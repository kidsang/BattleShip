if (module) Bullet = require('./Bullet.js');
if (module) Constants = require('./Constants.js');

VulcanBullet = function(world, playerId, config) {
	config.box = [4 / Constants.drawScale, 2 / Constants.drawScale];
	config.speed = 400 / Constants.drawScale;

	Bullet.call(this, world, playerId, config);

	this.life = 2;
};

VulcanBullet.prototype = Object.create(Bullet.prototype);

if (module) module.exports = VulcanBullet;