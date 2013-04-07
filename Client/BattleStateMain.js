BattleState = function(msg) {
	this.myid = msg.playerId;
	this.socket = msg.socket;
	this.players = {};
	this.myShip = undefined;
	this.servTimeDiff = 0;
	this.delay = 0;
	this.nowTime = 0;
	this.lastTime = 0;
	this.schedule = new Schedule();
	this.bulletMgr = new BulletManager();

	this.layer = new Kinetic.Layer();
	stage.add(this.layer);
	this.bulletLayer = new Kinetic.Group();
	this.layer.add(this.bulletLayer);
	this.shipLayer = new Kinetic.Group();
	this.layer.add(this.shipLayer);
	this.explodeLayer = new Kinetic.Group();
	this.layer.add(this.explodeLayer);
	this.mapLayer = new Kinetic.Group();
	this.layer.add(this.mapLayer);

	this.uiLayer = new Kinetic.Layer();
	stage.add(this.uiLayer);

	this.debugLayer = new Kinetic.Layer();
	stage.add(this.debugLayer);

	this.hitLayer = new Kinetic.Layer();
	stage.add(this.hitLayer);
	this.hitLayer.add(new Kinetic.Rect({
		width:Constants.stageWidth,
		height:Constants.stageHeight,
		fill:'red',
		opacity:0
	}));
	this.hitLayer.draw();

	this.explodeMgr = new ExplodeManager(this.explodeLayer);

	this.world = new b2World(new b2Vec2(0, 0), false);
	this.world.SetContactListener({
		BeginContact:function(){},
		EndContact:function(){},
		PreSolve:Contacts.preSolve,
		PostSolve:function(){}
	});

	var mapDef = MapGen.gen(msg.mapSeed, msg.numObstacle);
	var map = new MapClient(mapDef, this.world, this.mapLayer);

	this.initializeNetwork();
	this.initializeControl();
};

BattleState.prototype.finalize = function() {
	this.finalizeControl();
	this.finalizeNetwork();

	for (var id in this.players) {
		var player = this.players[id];
		player.finalize();
		delete this.players[id];
	}

	this.explodeMgr.finalize();
	this.bulletMgr.finalize();

	delete this.world;
	this.hitLayer.destroy();
	this.debugLayer.destroy();
	this.uiLayer.destroy();
	this.layer.destroy();
};

BattleState.prototype.step = function() {
	this.nowTime = (new Date()).getTime();
	if (!this.lastTime)
		this.lastTime = this.nowTime;
	var timeDiff = this.nowTime - this.lastTime;
	var secDiff = timeDiff / 1000;
	this.lastTime = this.nowTime;

	this.schedule.step(this.nowTime);
	this.bulletMgr.step();
	this.explodeMgr.step();

	this.world.Step(secDiff, 1, 1);
	this.world.ClearForces();

	if (this.myShip) {
		var ship = this.myShip;
		for (var index in ship.weapons) {
			var weapon = ship.weapons[index];
			weapon.coldDown(secDiff);
		}
	}

	for (var id in this.players) {
		var player = this.players[id];
		var ship = player.ship;
		ship.updateKinematicsByAction();
		ship.updateSkin();
	}

	this.bulletMgr.updateSkin();
	this.scrollMap();
	this.updateUI();

	this.layer.clear();
	this.layer.drawScene();
	this.uiLayer.clear();
	this.uiLayer.drawScene();
	// this.debugLayer.clear();
	// this.world.DrawDebugData();
};

BattleState.prototype.scrollMap = function() {
	var player = this.players[this.myid];
	if (!player || !this.layer)
		return;

	var ship = player.ship;
	var offset = 0;
	var step = 100 / Constants.frameRate;
	var pos = ship.body.GetPosition();
	var angle = ship.body.GetAngle();
	var cos = Math.cos(angle);
	var sin = Math.sin(angle);
	// c == center
	var cx = pos.x + cos * offset;
	var cy = pos.y + sin * offset;
	cx *= Constants.drawScale;
	cy *= Constants.drawScale;

	// l == layer
	var lx = Constants.stageWidth / 2 - cx; 
	var ly = Constants.stageHeight / 2 - cy;
	var borders = [
		0,
		0,
		-Constants.mapWidth + Constants.stageWidth,
		-Constants.mapHeight + Constants.stageHeight
	];
	if (lx > borders[0])
		lx = borders[0];
	else if (lx < borders[2])
		lx = borders[2];
	if (ly > borders[1])
		ly = borders[1];
	else if (ly < borders[3])
		ly = borders[3];

	var x = this.layer.getX();
	var y = this.layer.getY();

	if (lx - x > step)
		x += step;
	else if (lx - x < -step)
		x -= step;
	else
		x = lx;

	if (ly - y > step)
		y += step;
	else if (ly - y < -step)
		y -= step;
	else
		y = ly;

	this.layer.setX(x);
	this.layer.setY(y);
};
