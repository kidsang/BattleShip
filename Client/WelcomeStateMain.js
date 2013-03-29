WelcomeState = function() {
	var layer = new Kinetic.Layer();
	this.layer = layer;
	stage.add(layer);

	var bg = new Kinetic.Image({
		image:Resource.imgs['fighter_bg'],
		opacity:0.5
	});
	layer.add(bg);

	var tip = new HexLabel('输入名称以继续', 25, 250);
	this.tip = tip;
	tip.group.setX(Constants.stageWidth / 2);
	tip.group.setY(Constants.stageHeight / 2 - 100);
	tip.show(true);
	layer.add(tip.group);

	var ok = new HexButton('确定', 30, 200);
	this.ok = ok;
	ok.group.setX(Constants.stageWidth / 2);
	ok.group.setY(Constants.stageHeight / 2 + 100);
	ok.show(true);
	layer.add(ok.group);

	var root = document.getElementById('canvas');
	var input = new TextInput(root, {
		width:200,
		maxLength:20,
		fontSize:30,
		x:Constants.stageWidth / 2 - 100,
		y:200,
		opacity:0.75,
		align:'center'
	});
	this.input = input;
	input.show(true);

	var that = this;
	ok.on('click', function() {
		var name = input.getValue().trim();
		if (name.length > 0) {
			myname = name;
			that.leave();
		}
	});
};

WelcomeState.prototype.finalize = function() {
	this.tip.finalize();
	this.ok.finalize();
	this.input.finalize();
	this.layer.destroy();
};

WelcomeState.prototype.step = function() {
	this.layer.draw();
};

WelcomeState.prototype.leave = function() {
	this.tip.on('hide', function() {
		jumpTo(CreateOrJoinState);
	});
	this.tip.hide(true);
	this.ok.hide(true);
	this.input.hide(true);
};
