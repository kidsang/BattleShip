JoinBattleState = function(msg) {
 	var layer = new Kinetic.Layer();
 	this.layer = layer;
 	stage.add(layer);

 	var loading = new HexLoading();
 	this.loading = loading;
 	loading.group.setX(Constants.stageWidth / 2);
 	loading.group.setY(Constants.stageHeight / 2 - 40);
 	layer.add(loading.group);

 	var text = new Kinetic.Text({
 		x:Constants.stageWidth / 2,
 		y:Constants.stageHeight / 2 + 60,
 		offset:[300, 0],
 		width:600,
 		align:'center',
 		text:'...',
 		fontFamily:'黑体',
 		fill:'black',
 		fontSize:20,
 		opacity:0.8
 	});
 	layer.add(text);

	var socket = msg.socket;

	var joinBattle = function(id) {
		loading.setPercent(0.5);
		text.setText('正在加入战局...');
		socket.emit(Proto.JOIN_BATTLE_FIELD, id);
	};
	socket.on(Proto.CREATE_BATTLE_FIELD_DONE, joinBattle);

	socket.on(Proto.NEW_JOIN, function(playerId, mapSeed, numObstacle) {
		loading.setPercent(1);
		var msg = {};
		msg.socket = socket;
		msg.playerId = playerId;
		msg.mapSeed = mapSeed;
		msg.numObstacle = numObstacle;
		setTimeout(function(){jumpTo(BattleState, msg)}, 1000);
	});

	delete msg.socket;
	if (msg.action == 'create') {
		delete msg.action;
		socket.emit(Proto.CREATE_BATTLE_FIELD, msg);
		text.setText('正在创建战局...');
	}
	else {
		joinBattle(msg.id);
	}
};

JoinBattleState.prototype.finalize = function() {
	this.loading.finalize();
	this.layer.destroy();
};

JoinBattleState.prototype.step = function() {
	this.layer.draw();
};
