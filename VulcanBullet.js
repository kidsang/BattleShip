if (module) Bullet = require('./Bullet.js');
if (module) Constants = require('./Constants.js');

VulcanBullet = function(world, playerId, config) {
	config.box = [4 / Constants.drawScale, 2 / Constants.drawScale];
	this.speed = 400 / Constants.drawScale;
	var vx = Math.cos(config.angle) * this.speed;
	var vy = Math.sin(config.angle) * this.speed;
	config.vx = vx;
	config.vy = vy;

	Bullet.call(this, world, playerId, config);

	this.life = 2;
};

VulcanBullet.prototype = Object.create(Bullet.prototype);

if (module) module.exports = VulcanBullet;