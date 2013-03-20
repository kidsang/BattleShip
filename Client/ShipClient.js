ShipClient = function(id, world, layer, config) {
	Ship.call(this, id, world, config);

	this.skin = new Kinetic.Polygon({
		points:[12, 0, -12, -8, -12, 8],
		fill:config.color,
		stroke:'black',
		strokeWidth:'1',
		listening:false
	});
	layer.add(this.skin);

	this.layer = layer;
};

ShipClient.prototype = Object.create(Ship.prototype);

ShipClient.prototype.finalize = function() {
	this.skin.destroy();
	Ship.prototype.finalize.call(this);
};

ShipClient.prototype.updateKinematicsByAction = function() {
	var angularVelocity = 0;
	if (this.actions['left']) {
		angularVelocity -= this.angularVelocity;
	}
	if (this.actions['right']) {
		angularVelocity += this.angularVelocity;
	}
	this.body.SetAngularVelocity(angularVelocity);

	var velocity = this.body.GetLinearVelocity().Length();
	if (this.actions['up']) {
		velocity += this.acceleration;
		if (velocity > this.maxVelocity)
			velocity = this.maxVelocity;
	}
	else if (this.actions['down']) {
		velocity -= this.acceleration;
		if (velocity < this.minVelocity)
			velocity = this.minVelocity;
	}

	var angle = this.body.GetAngle();
	var vx = Math.cos(angle) * velocity;
	var vy = Math.sin(angle) * velocity; 
	this.body.SetLinearVelocity(new b2Vec2(vx, vy));
};

ShipClient.prototype.updateSkin = function() {
	var skin = this.skin;
	var pos = this.body.GetPosition();
	skin.setX(pos.x * Constants.drawScale);
	skin.setY(pos.y * Constants.drawScale);
	skin.setRotation(this.body.GetAngle());
}