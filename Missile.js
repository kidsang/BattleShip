if (module) Weapon = require('./Weapon.js');
if (module) MissileBullet = require('./MissileBullet.js');

Missile = function() {
	Weapon.call(this);

	this.heatGenerated = 100;
	this.fireInterval = 0.5;
	this.name = 'Missile';

	this.numBullets = 4;
};

Missile.prototype = Object.create(Weapon.prototype);

Missile.prototype._getAngles = function(angle) {
	var gap = Math.PI / (this.numBullets + 1);
	var beg = angle - Math.PI / 2;
	var angles = [];
	for (var i = 1; i <= this.numBullets; ++i)
		angles.push(beg + gap * i);
	return angles;
};

Missile.prototype.fire = function(world, playerId, config) {
	Weapon.prototype.fire.apply(this);
	var bullets = [];
	var angles = this._getAngles(config.angle);
	for (var i = 0; i < angles.length; ++i) {
		config.angle = angles[i];
		bullets.push(new MissileBullet(world, playerId, config));
	}
	return bullets;
};

if (module) module.exports = Missile;