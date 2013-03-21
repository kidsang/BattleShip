LaserBulletClient = function(world, playerId, config) {
	LaserBullet.call(this, world, playerId, config);
	this.explodeAnis = [];
};


LaserBulletClient.prototype = Object.create(LaserBullet.prototype);

LaserBulletClient.prototype.finalize = function() {
	LaserBullet.prototype.finalize.call(this);
};

LaserBulletClient.prototype.setSkin = function(layer, color, length) {
	this.skin = new Kinetic.Rect({
		width:length * Constants.drawScale,
		height:1,
		fill:color
	});
	layer.add(this.skin);
	this.layer = layer;
};

LaserBulletClient.prototype.explode = function() {
	var alpha = this.skin.getOpacity() - 0.02;
	if (alpha < 0) {
		this.skin.destroy();
		this.exploded = true;
	}
	else {
		this.skin.setOpacity(alpha);
	}
};

LaserBulletClient.prototype.updateSkin = function() {
	var skin = this.skin;
	var pos = this.body.GetPosition();
	skin.setX(pos.x * Constants.drawScale);
	skin.setY(pos.y * Constants.drawScale);
	skin.setRotation(this.body.GetAngle());
};
