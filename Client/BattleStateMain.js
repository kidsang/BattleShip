BS = {};

BS.initialize = function() {
	BS.myid = 0;
	BS.players = {};

	BS.bgLayer = new Kinetic.Layer();
	stage.add(BS.bgLayer);
	BS.shipLayer = new Kinetic.Layer();
	stage.add(BS.shipLayer);

	var bg = new Kinetic.Rect({
		width:stageWidth,
		height:stageHeight,
		stroke:'black',
		strokeWidth:2
	});
	BS.bgLayer.add(bg);

	BS.world = new b2World(new b2Vec2(0, 0), false);
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(stage.getContent().firstChild.getContext("2d"));
	debugDraw.SetDrawScale(1.0);
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
		delete player;
	}

	delete BS.world;
	BS.bgLayer.remove();
	delete BS.bgLayer;
	BS.shipLayer.remove();
	delete BS.shipLayer;
};

BS.mainLoop = function() {
	BS.world.Step(1 / Constants.frameRate, 1, 1);
	BS.world.ClearForces();

	for (var id in BS.players) {
		var player = BS.players[id];
		var ship = player.ship;
		if (id == BS.myid) {
			ship.updateKinematicsByAction();
		}
		ship.updateSkin();
	}

	stage.drawScene();
	BS.world.DrawDebugData();
};

BS.syncLoop = function() {
	var player = BS.players[BS.myid];
	if (player) {
		var ship = player.ship;
		BS.socket.emit('sync position', ship.getKinematicsPackage());
	}
}

Keyboard.onKeyDown(function(event) {
	var player = BS.players[BS.myid];
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
	}
	if (keyStr != null) {
		var ship = player.ship;
		ship.applyAction(keyStr, true);
	}
});

Keyboard.onKeyUp(function(event) {
	var player = BS.players[BS.myid];
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
	}
	if (keyStr != null) {
		var ship = player.ship;
		ship.applyAction(keyStr, false);
	}
});
