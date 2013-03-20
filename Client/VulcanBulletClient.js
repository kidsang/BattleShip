VulcanBulletClient = function(world, layer, playerId, config) {
	VulcanBullet.call(this, world, playerId, config);

	this.skin = new Kinetic.Rect({
		offset:{x:3, y:1},
		width:6,
		height:2,
		fill:config.color
	});
	layer.add(this.skin);
	this.layer = layer;
};

VulcanBulletClient.prototype = Object.create(VulcanBullet.prototype);

VulcanBulletClient.prototype.finalize = function() {
	this.explodeAni.skin.destroy();
	this.skin.destroy();
	VulcanBullet.prototype.finalize.call(this);
};

VulcanBulletClient.prototype.explode = function() {
	if (!this.explodeAni) {
		var pos = this.body.GetPosition();
		this.explodeAni = new Explode(pos.x * Constants.drawScale, pos.y * Constants.drawScale);
		this.layer.add(this.explodeAni.skin);
	}
	if (this.explodeAni.isFinished()) {
		this.exploded = true;
	}
	else {
		this.explodeAni.step();
	}
};

VulcanBulletClient.prototype.updateSkin = function() {
	var skin = this.skin;
	var pos = this.body.GetPosition();
	skin.setX(pos.x * Constants.drawScale);
	skin.setY(pos.y * Constants.drawScale);
	skin.setRotation(this.body.GetAngle());
};
