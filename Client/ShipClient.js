ShipClient = function(id, world, layer, config) {
	Ship.call(this, id, world, config);

	this.skin = new Kinetic.Group({});
	layer.add(this.skin);

	var fill = new Kinetic.Polygon({
		points:[12, 0, -12, -8, -12, 8],
		fill:config.color,
		opacity:0.3,
		listening:false
	});
	this.skin.add(fill);

	var border = new Kinetic.Polygon({
		points:[12, 0, -12, -8, -12, 8],
		stroke:config.color,
		strokeWidth:'2',
		listening:false
	});
	this.skin.add(border);

	this.layer = layer;

	// this.mouseX = 0;
	// this.mouseY = 0;
	// this.mousedown = false;
};

ShipClient.prototype = Object.create(Ship.prototype);

ShipClient.prototype.finalize = function() {
	this.skin.destroy();
	Ship.prototype.finalize.call(this);
};

ShipClient.prototype.updateSkin = function() {
	var skin = this.skin;
	var pos = this.body.GetPosition();
	skin.setX(pos.x * Constants.drawScale);
	skin.setY(pos.y * Constants.drawScale);
	skin.setRotation(this.body.GetAngle());
};