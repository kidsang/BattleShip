ConnectingState = function(msg) {
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
 		text:'正在建立连接...',
 		fontFamily:'黑体',
 		fill:'black',
 		fontSize:20,
 		opacity:0.8
 	});
 	layer.add(text);

	var host = '192.168.1.103';
	if (__deploy)
		host = 'http://battleship.chidongxi.me/';
	var socket = io.connect(host);

	socket.on('connect', function() {
		loading.setPercent(1);
		var msg = {'socket':socket};
		setTimeout(function(){jumpTo(CreateOrJoinState, msg)}, 1000)
	});

};

ConnectingState.prototype.finalize = function() {
	this.loading.finalize();
	this.layer.destroy();
};

ConnectingState.prototype.step = function() {
	this.layer.draw();
};
