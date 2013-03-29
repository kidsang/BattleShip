BattleState = function(msg) {
	this.myid = msg.playerId;
	this.socket = msg.socket;
	this.players = {};
	this.bulletMgr = new BulletManager();
	this.explodeMgr = new ExplodeManager();

	this.layer = new Kinetic.Layer();
	stage.add(this.layer);
	this.bulletLayer = new Kinetic.Group();
	this.layer.add(this.bulletLayer);
	this.shipLayer = new Kinetic.Group();
	this.layer.add(this.shipLayer);
	this.mapLayer = new Kinetic.Group();
	this.layer.add(this.mapLayer);

	this.uiLayer = new Kinetic.Layer();
	stage.add(this.uiLayer);

	this.debugLayer = new Kinetic.Layer();
	stage.add(this.debugLayer);

	this.world = new b2World(new b2Vec2(0, 0), false);
	this.world.SetContactListener({
		BeginContact:function(){},
		EndContact:function(){},
		PreSolve:Contacts.preSolve,
		PostSolve:function(){}
	});

	var mapDef = MapGen.gen(msg.mapSeed, msg.numObstacle);
	var map = new MapClient(mapDef, this.world, this.mapLayer);

	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(this.debugLayer.getCanvas().getContext());
	debugDraw.SetDrawScale(Constants.drawScale);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	this.world.SetDebugDraw(debugDraw);

	// this.mainLoopToken = setInterval(this.mainLoop, Constants.frameInterval);
	// this.syncLoopToken = setInterval(this.syncLoop, Constants.posSyncInterval);

	this.initializeNetwork();
	this.initializeControl();
};

BattleState.prototype.finalize = function() {
	this.finalizeControl();
	this.finalizeNetwork();

	// clearInterval(BS.syncLoopToken);
	// delete BS.syncLoopToken;
	// clearInterval(BS.mainLoopToken);
	// delete BS.mainLoopToken;

	for (var id in this.players) {
		var player = this.players[id];
		player.finalize();
		delete this.players[id];
	}

	this.explodeMgr.finalize();
	this.bulletMgr.finalize();

	delete this.world;
	this.debugLayer.destroy();
	this.uiLayer.destroy();
	this.layer.destroy();
};

BattleState.prototype.step = function() {

	this.bulletMgr.step();
	this.explodeMgr.step();

	this.world.Step(1 / Constants.frameRate, 1, 1);
	this.world.ClearForces();

	if (this.players[this.myid]) {

		var player = this.players[this.myid];
		var ship = player.ship;
		ship.updateKinematicsByAction();
		if (ship.actions['fire']) {
			var weapon = ship.weapons[ship.currentWeaponIndex];
			if (weapon.canFire()) {
				var pos = ship.body.GetPosition();
				var msg = {
					weapon:ship.currentWeaponIndex,
					x:pos.x,
					y:pos.y,
					angle:ship.body.GetAngle()
				};
				this.socket.emit(Proto.REQUEST_FIRE, msg);
			}
		}

		for (var index in ship.weapons) {
			var weapon = ship.weapons[index];
			weapon.coldDown();
		}
	}

	for (var id in this.players) {
		var player = this.players[id];
		var ship = player.ship;
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

BattleState.prototype.initializeControl = function() {
	var that = this;

	Keyboard.onKeyDown(function(event) {
		var player = that.players[that.myid];
		var ship = player.ship;

		var keyStr = null;
		switch (event.keyCode) {
			case 37:
			keyStr = 'left';
			break;
			case 38:
			keyStr = 'up';
			break;
			case 39:
			keyStr = 'right';
			break;
			case 40:
			keyStr = 'down';
			break;
			case 32:
			keyStr = 'fire';
			break;
		}
		if (keyStr != null) {
			ship.applyAction(keyStr, true);
		}
		if (event.keyCode >= 49 && event.keyCode < 49 + ship.weapons.length) {
			ship.currentWeaponIndex = event.keyCode - 49;
		};
	});

	Keyboard.onKeyUp(function(event) {
		var player = that.players[that.myid];
		var ship = player.ship;

		var keyStr = null;
		switch (event.keyCode) {
			case 37:
			keyStr = 'left';
			break;
			case 38:
			keyStr = 'up';
			break;
			case 39:
			keyStr = 'right';
			break;
			case 40:
			keyStr = 'down';
			break;
			case 32:
			keyStr = 'fire';
			break;
		}
		if (keyStr != null) {
			ship.applyAction(keyStr, false);
		}
	});

};

BattleState.prototype.finalizeControl = function() {
	Keyboard.clear();
};
