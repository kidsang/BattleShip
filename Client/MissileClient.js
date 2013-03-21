MissileClient = function() {
	Missile.call(this);
};

MissileClient.prototype = Object.create(Missile.prototype);

MissileClient.prototype.fire = function(world, layer, playerId, config) {
	Weapon.prototype.fire.apply(this);
	var bullets = [];
	var angles = this._getAngles(config.angle);
	for (var i = 0; i < angles.length; ++i) {
		config.angle = angles[i];
		bullets.push(new MissileBulletClient(world, layer, playerId, config));
	}
	return bullets;
};