ExplodeManager = function(layer) {
	this.explodes = [];
	this.layer = layer;
};

ExplodeManager.prototype.createExplode = function(x, y) {
	var dx = x * Constants.drawScale + Math.random() * 10 - 5;
	var dy = y * Constants.drawScale + Math.random() * 10 - 5;
	var ani  = new Explode(dx, dy);
	this.layer.add(ani.skin);
	this.explodes.push(ani);
};

ExplodeManager.prototype.finalize = function() {
	for (var i in this.explodes) {
		this.explodes[i].skin.destroy();
	}
};

ExplodeManager.prototype.step = function() {
	for (var i = this.explodes.length - 1; i >= 0; --i) {
		var ani = this.explodes[i];
		if (ani.isFinished()) {
			ani.skin.destroy();
			this.explodes.splice(i, 1);
		}
		else {
			ani.step();
		}
	}
};