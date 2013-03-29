LaserClient = function() {
	Laser.call(this);
};

LaserClient.prototype = Object.create(Laser.prototype);

LaserClient.prototype.fire = function(world, layer, playerId, config) {
	Weapon.prototype.fire.apply(this);
	var bullet = new LaserBulletClient(world, playerId, config);
	var fraction = Contacts.laserCast(bullet, world, config.x, config.y, config.angle, this.laserLength);
	var length = this.laserLength * fraction;
	bullet.setSkin(layer, config.color, length);
	// bullet.setHitPoints(result[1]);
	return bullet;
};