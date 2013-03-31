JoinRoomState = function(msg) {
 	var layer = new Kinetic.Layer();
 	this.layer = layer;
 	stage.add(layer);
 	var entries = [];
 	this.entries = entries;
 	this.refreshing = true;

 	var loadingText = new Kinetic.Text({
 		x:Constants.stageWidth / 2,
 		y:Constants.stageHeight / 2,
 		text:'刷新中……',
		fontSize:22,
		fontFamily:'微软雅黑, 黑体',
		fill:'#000'
 	});
 	this.loadingText = loadingText;
 	loadingText.setOffset(loadingText.getWidth() / 2, loadingText.getHeight() / 2);
 	layer.add(loadingText);

 	var refresh = new HexButton('刷新', 30, 200);
 	this.refresh = refresh;
 	refresh.group.setX(Constants.stageWidth / 2);
 	refresh.group.setY(410);
 	layer.add(refresh.group);
 	refresh.show(true);

 	var socket = msg.socket;

 	var that = this;
 	refresh.on('click', function() {
 		if (that.refreshing)
 			return;
 		that.refreshing = true;
 		loadingText.setVisible(true);
 		for (var i in entries) {
 			entries[i].finalize();
 			entries[i].group.destroy();
 		}
 		entries.splice(0);
 		socket.emit(Proto.REQUEST_BATTLE_FIELD_LIST);
 	});

 	socket.on(Proto.RESPONSE_BATTLE_FIELD_LIST, function(bfList) {
 		loadingText.setVisible(false);
 		var i = 0;
 		for (var id in bfList) {
 			var bf = bfList[id];
 			var entry = new RoomEntry(bf.name, bf.numPlayer, bf.maxPlayer, bf.obstacle, bf.mode);
 			entry.group.__id = id;
 			entry.group.setX(Constants.stageWidth / 2);
 			entry.group.setY(entry.height * i + 60);
 			layer.add(entry.group);
 			entries.push(entry);
 			entry.show(true);
 			++i;

 			entry.on('click', function() {
 				var msg = {
 					'socket':socket,
 					'id':this.__id
 				};
 				jumpTo(JoinBattleState, msg);
 			});
 		}
 		that.refreshing = false;
 	});

 	socket.emit(Proto.REQUEST_BATTLE_FIELD_LIST);

};

JoinRoomState.prototype.finalize = function() {
	this.refresh.finalize();
	this.layer.destroy();
};

JoinRoomState.prototype.step = function() {
	this.layer.draw();
};

