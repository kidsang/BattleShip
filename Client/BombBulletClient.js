BombBulletClient = function(world, layer, playerId, config) {
	BombBullet.call(this, world, playerId, config);

	var r = this.radius * Constants.drawScale;
	this.skin = new Kinetic.Circle({
		radius:r,
		stroke:config.color,
		strokeWidth:1.5,
		fill:'white',
		opacity:0.75
	});
	layer.add(this.skin);
	this.layer = layer;
	this.world = world;
};

BombBulletClient.prototype = Object.create(BombBullet.prototype);

BombBulletClient.prototype.finalize = function() {
	this.skin.destroy();
	BombBullet.prototype.finalize.call(this);
};

BombBulletClient.prototype.fly = function() {
	this.scaling();
	Contacts.bombCast(this, this.world, this.body.GetPosition(), this.radius * this.scale);
};

// BombBulletClient.prototype.explode = function() {
// 	if (!this.explodeAni) {
// 		var pos = this.body.GetPosition();
// 		this.explodeAni = new Explode(pos.x * Constants.drawScale, pos.y * Constants.drawScale);
// 		this.layer.add(this.explodeAni.skin);
// 	}
// 	if (this.explodeAni.isFinished()) {
// 		this.exploded = true;
// 		this.explodeAni.skin.destroy();
// 	}
// 	else {
// 		this.explodeAni.step();
// 	}
// };

BombBulletClient.prototype.updateSkin = function() {
	var skin = this.skin;
	var pos = this.body.GetPosition();
	skin.setX(pos.x * Constants.drawScale);
	skin.setY(pos.y * Constants.drawScale);
	skin.setScale(this.scale, this.scale);
	skin.setStrokeWidth(1.5 / this.scale);
};
