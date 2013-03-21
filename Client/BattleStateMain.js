BS = {};

BS.initialize = function() {
	BS.myid = 0;
	BS.players = {};
	BS.bulletMgr = new BulletManager();
	BS.explodeMgr = new ExplodeManager();
	BS.weaponTags = [];

	BS.bgLayer = new Kinetic.Layer();
	stage.add(BS.bgLayer);
	BS.shipLayer = new Kinetic.Layer();
	stage.add(BS.shipLayer);
	BS.bulletLayer = new Kinetic.Layer();
	stage.add(BS.bulletLayer);
	BS.uiLayer = new Kinetic.Layer();
	stage.add(BS.uiLayer);

	var bg = new Kinetic.Rect({
		width:stageWidth,
		height:stageHeight,
		stroke:'black',
		strokeWidth:2
	});
	BS.bgLayer.add(bg);

	BS.world = new b2World(new b2Vec2(0, 0), false);
	BS.world.SetContactListener({
		BeginContact:function(){},
		EndContact:function(){},
		PreSolve:Contacts.preSolve,
		PostSolve:function(){}
	});

	// var wconfig = {
	// 	type:2,
	// 	x:0,
	// 	y:stageHeight / 2 / Constants.drawScale,
	// 	box:[6 / Constants.drawScale, stageHeight / 2 / Constants.drawScale]
	// };
	// var leftWall = new GameObject(BS.world, wconfig)
	// wconfig.x = stageWidth / Constants.drawScale;
	// var rightWall = new GameObject(BS.world, wconfig)
	// wconfig.x = stageWidth / 2 / Constants.drawScale;
	// wconfig.y = 0;
	// wconfig.box = [stageWidth / 2 / Constants.drawScale, 6 / Constants.drawScale];
	// var topWall = new GameObject(BS.world, wconfig)
	// wconfig.y = stageHeight / Constants.drawScale;
	// var bottomWall = new GameObject(BS.world, wconfig)

	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(stage.getContent().firstChild.getContext("2d"));
	debugDraw.SetDrawScale(Constants.drawScale);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	BS.world.SetDebugDraw(debugDraw);

	BS.mainLoopToken = setInterval(BS.mainLoop, Constants.frameInterval);
	BS.syncLoopToken = setInterval(BS.syncLoop, Constants.posSyncInterval);

	BS.initializeNetwork();
};

BS.finalize = function() {
	BS.finalizeNetwork();

	clearInterval(BS.syncLoopToken);
	delete BS.syncLoopToken;
	clearInterval(BS.mainLoopToken);
	delete BS.mainLoopToken;

	for (var id in BS.players) {
		var player = BS.players[id];
		player.finalize();
		delete BS.players[id];
	}
	delete BS.players;

	BS.explodeMgr.finalize();
	delete BS.explodeMgr;
	BS.bulletMgr.finalize();
	delete BS.bulletMgr;

	delete BS.weaponTags;

	delete BS.world;
	BS.uiLayer.destroy();
	Bs.bulletLayer.destroy();
	BS.bgLayer.destroy();
	BS.shipLayer.destroy();
};

BS.mainLoop = function() {

	BS.bulletMgr.step();
	BS.explodeMgr.step();

	BS.world.Step(1 / Constants.frameRate, 1, 1);
	BS.world.ClearForces();

	if (BS.players[BS.myid]) {
		if (BS.weaponTags.length == 0) {
			BS.initUI();
		}

		var player = BS.players[BS.myid];
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
				BS.socket.emit('fire', msg);
			}
		}

		for (var index in ship.weapons) {
			var weapon = ship.weapons[index];
			weapon.coldDown();
		}
	}

	for (var id in BS.players) {
		var player = BS.players[id];
		var ship = player.ship;
		ship.updateSkin();
	}

	BS.bulletMgr.updateSkin();

	for (var i in BS.weaponTags) {
		var tag = BS.weaponTags[i];
		tag.updateSkin();
	}

	stage.drawScene();
	BS.world.DrawDebugData();
};

BS.initUI = function() {
	var player = BS.players[BS.myid];
	var ship = player.ship;
	var y = 0;
	var gap = 70;
	for (var index in ship.weapons) {
		var weapon = ship.weapons[index];
		var tag = new WeaponTag(weapon, index * gap, y);
		BS.uiLayer.add(tag.skin);
		BS.weaponTags.push(tag);
	}
};

BS.syncLoop = function() {
	var player = BS.players[BS.myid];
	if (player) {
		var ship = player.ship;
		BS.socket.emit('sync position', ship.getKinematicsPackage());
	}
};

Keyboard.onKeyDown(function(event) {
	var player = BS.players[BS.myid];
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
	var player = BS.players[BS.myid];
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
