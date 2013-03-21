MissileBulletClient = function(world, layer, playerId, config) {
	MissileBullet.call(this, world, playerId, config);

	this.skin = new Kinetic.Polygon({
		points:[5, 0, 0, -3, -10, 0, 0, 3],
		// offset:{x:3, y:1},
		stroke:'#333',
		strokeWidth:1,
		fill:config.color
	});
	layer.add(this.skin);
	this.color = config.color;
	this.layer = layer;
	this.flames = [];
};

MissileBulletClient.prototype = Object.create(MissileBullet.prototype);

MissileBulletClient.prototype.finalize = function() {
	this.skin.destroy();
	for (var i = this.flames.length - 1; i >= 0; --i) {
		var flame = this.flames[i];
		flame.destroy();
	}
	MissileBullet.prototype.finalize.call(this);
};

MissileBulletClient.prototype.fly = function() {
	var nowSec = (new Date()).getTime();
	if (nowSec - this.fireTime > 500) {
		var nearest = this._findNearestShip(BS.players);
		if (nearest)
			this._trace(nearest);
	}
};

MissileBulletClient.prototype.explode = function() {
	if (!this.explodeAni) {
		this.skin.destroy();
		var pos = this.body.GetPosition();
		this.explodeAni = new Explode(pos.x * Constants.drawScale, pos.y * Constants.drawScale);
		this.layer.add(this.explodeAni.skin);
	}
	if (this.explodeAni.isFinished()) {
		this.exploded = true;
		this.explodeAni.skin.destroy();
	}
	else {
		this.explodeAni.step();
	}
};

MissileBulletClient.prototype.updateSkin = function() {
	var skin = this.skin;
	var pos = this.body.GetPosition();
	var x_ = pos.x * Constants.drawScale;
	var y_ = pos.y * Constants.drawScale;
	var ang_ = this.body.GetAngle();
	skin.setX(x_);
	skin.setY(y_);
	skin.setRotation(ang_);

	var w = this.speed * Constants.drawScale / Constants.frameRate;
	var flame = new Kinetic.Rect({
		width:w,
		height:2,
		offset:{x:w/2, y:1},
		x:x_,
		y:y_,
		rotation:ang_,
		fill:this.color
	})
	this.layer.add(flame);
	this.flames.push(flame);

	for (var i = this.flames.length - 1; i >= 0; --i) {
		var flame = this.flames[i];
		var alpha = flame.getOpacity() - 0.035;
		if (alpha <= 0) {
			flame.destroy();
			this.flames.splice(i, 1);
		}
		else {
			flame.setOpacity(alpha);
		}
	}
};
