if (module) Bullet = require('./Bullet.js');
if (module) Constants = require('./Constants.js');
if (module) ContactsServer = require('./ContactsServer.js');

BombBullet = function(world, playerId, config) {
	config.circle = 1 / Constants.drawScale;
	// config.box = [50 / Constants.drawScale, 50 / Constants.drawScale];
	config.speed = 100 / Constants.drawScale;

	Bullet.call(this, world, playerId, config);

	this.life = 3;
	this.radius = 50 / Constants.drawScale;
	this.scale = 0.2;
};

BombBullet.prototype = Object.create(Bullet.prototype);

BombBullet.prototype.fly = function() {
	this.scaling();
	ContactsServer.bombCast(this, this.world, this.body.GetPosition(), this.radius * this.scale);
};

BombBullet.prototype.scaling = function() {
	var nowTime = (new Date()).getTime();
	if (nowTime - this.fireTime < 500) {
		this.scale = 0.2;
	}
	else if (nowTime - this.fireTime < 800) {
		this.scale += 0.044; // 0.8 / 300 * 1000 / 60
	}
	else if (nowTime - this.fireTime < (this.life - 0.4) * 1000) {
		this.scale = 1;
	}
	else {
		this.scale -= 0.0416; // 1 / 400 * 1000 / 60
	}
};

if (module) module.exports = BombBullet;