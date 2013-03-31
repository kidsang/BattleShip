CreateOrJoinState = function(msg) {
	var layer = new Kinetic.Layer();
	this.layer = layer;
	stage.add(layer);

	this.socket = msg.socket;

	// var bg = new Kinetic.Image({
	// 	image:Resource.imgs['fighter_bg'],
	// 	opacity:0.5
	// });
	// layer.add(bg);

	var create = new HexButton('创建战局', 25, 250);
	this.create = create;
	create.group.setX(Constants.stageWidth / 2);
	create.group.setY(Constants.stageHeight / 2 - 60);
	layer.add(create.group);
	create.show(true);

	var join = new HexButton('加入战局', 25, 250);
	this.join = join;
	join.group.setX(Constants.stageWidth / 2);
	join.group.setY(Constants.stageHeight / 2 + 60);
	layer.add(join.group);
	join.show(true);

	var that = this;

	create.on('click', function() {
		that.leave(CreateRoomState);
	});

	join.on('click', function() {
		that.leave(JoinRoomState);
	});
};

CreateOrJoinState.prototype.finalize = function() {
	this.create.finalize();
	this.join.finalize();
	this.layer.destroy();
};

CreateOrJoinState.prototype.step = function() {
	this.layer.draw();
};

CreateOrJoinState.prototype.leave = function(nextState) {
	var socket = this.socket;
	this.create.on('hide', function() {
		jumpTo(nextState, {'socket':socket});
	});
	this.create.hide(true);
	this.join.hide(true);
};
