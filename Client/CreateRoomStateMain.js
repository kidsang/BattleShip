CreateRoomState = function() {
	var layer = new Kinetic.Layer();
	this.layer = layer;
	stage.add(layer);

	var bg = new Kinetic.Image({
		image:Resource.imgs['fighter_bg'],
		opacity:0.5
	});
	layer.add(bg);

	var numPlayer = new HexSelector('人数');
	this.numPlayer = numPlayer;
	numPlayer.addEntry(2);
	numPlayer.addEntry(4);
	numPlayer.addEntry(6);
	numPlayer.addEntry(8);
	numPlayer.addEntry(10);
	numPlayer.setIndex(1);
	numPlayer.group.setX(Constants.stageWidth / 4);
	numPlayer.group.setY(Constants.stageHeight / 2 - 60);
	layer.add(numPlayer.group);
	numPlayer.show(true);

	var obstacle = new HexSelector('障碍');
	this.obstacle = obstacle;
	obstacle.addEntry('无');
	obstacle.addEntry('少');
	obstacle.addEntry('多');
	obstacle.setIndex(1);
	obstacle.group.setX(Constants.stageWidth / 2);
	obstacle.group.setY(Constants.stageHeight / 2 - 60);
	layer.add(obstacle.group);
	obstacle.show(true);

	var mode = new HexSelector('模式');
	this.mode = mode;
	mode.addEntry('混战');
	mode.setIndex(0);
	mode.group.setX(Constants.stageWidth / 4 * 3);
	mode.group.setY(Constants.stageHeight / 2 - 60);
	layer.add(mode.group);
	mode.show(true);

	var ok = new HexButton('确认', 30, 200);
	this.ok = ok;
	ok.group.setX(Constants.stageWidth / 2);
	ok.group.setY(400);
	layer.add(ok.group);
	ok.show(true);

	var root = document.getElementById('canvas');
	var input = new TextInput(root, {
		width:200,
		height:60,
		maxLength:20,
		fontSize:30,
		x:Constants.stageWidth / 2 - 100,
		y:300,
		text:myname+'的战局',
		opacity:0.75,
		align:'center'
	});
	this.input = input;
	input.show(true);

	var handleExclusion = function(who) {
		if (who != numPlayer && numPlayer.expanded)
			numPlayer.fold(true);
		if (who != obstacle && obstacle.expanded)
			obstacle.fold(true);
		if (who != mode && mode.expanded)
			mode.fold(true);
	}; 

	numPlayer.on('click', function() {handleExclusion(numPlayer)});
	obstacle.on('click', function() {handleExclusion(obstacle)});
	mode.on('click', function() {handleExclusion(mode)});

	var that = this;
	ok.on('click', function() {
		var msg = {
			'action':'create',
			'room':input.getValue(),
			'numPlayer':numPlayer.getValue(),
			'obstacle':obstacle.getValue(),
			'mode':mode.getValue()
		}
		that.leave(msg);
	});
};

CreateRoomState.prototype.finalize = function() {
	this.numPlayer.finalize();
	this.obstacle.finalize();
	this.mode.finalize();
	this.ok.finalize();
	this.input.finalize();
	this.layer.destroy();
};

CreateRoomState.prototype.step = function() {
	this.layer.draw();
};

CreateRoomState.prototype.leave = function(msg) {
	this.ok.on('hide', function() {
		jumpTo(ConnectingState, msg);
	});
	this.numPlayer.hide(true);
	this.obstacle.hide(true);
	this.mode.hide(true);
	this.ok.hide(true);
	this.input.hide(true);
};
