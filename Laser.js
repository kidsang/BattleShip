if (module) Weapon = require('./Weapon.js');
if (module) LaserBullet = require('./LaserBullet.js');
if (module) ContactsServer = require('./ContactsServer.js');

Laser = function() {
	Weapon.call(this);

	this.heatGenerated = 40;
	this.fireInterval = 1;
	this.name = 'Laser';
	this.laserLength = 600 / Constants.drawScale;
};

Laser.prototype = Object.create(Weapon.prototype);

Laser.prototype.fire = function(world, playerId, config) {
	Weapon.prototype.fire.apply(this);
	var bullet = new LaserBullet(world, playerId, config);
	ContactsServer.laserCast(bullet, world, config.x, config.y, config.angle, this.laserLength);
	return bullet;
};

if (module) module.exports = Laser;