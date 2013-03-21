if (module) Bullet = require('./Bullet.js');
if (module) Constants = require('./Constants.js');

LaserBullet = function(world, playerId, config) {
	config.box = [1 / Constants.drawScale, 1 / Constants.drawScale];
	config.speed = 0 / Constants.drawScale;

	Bullet.call(this, world, playerId, config);
};

LaserBullet.prototype = Object.create(Bullet.prototype);

LaserBullet.prototype.fly = function() {
	this.hitted = true;
};

if (module) module.exports = LaserBullet;