Explode = function(x_, y_) {
	this.skin = new Kinetic.Circle({
		x:x_,
		y:y_,
		radius:10,
		fill:'white',
		stroke:'black',
		strokeWidth:1
	});
	this.skin.setScale(0, 0);
	this.totalSteps = 12;
	this.curStep = 1;
};

Explode.prototype.step = function() {
	var scale = this.curStep / this.totalSteps;
	this.skin.setScale(scale, scale);
	this.skin.setOpacity(1 - scale * 0.85);
	this.curStep += 1;
};

Explode.prototype.isFinished = function() {
	return this.curStep >= this.totalSteps;
};