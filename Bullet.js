if (module) GameObject = require('./GameObject');

Bullet = function(world, playerId, config) {
	GameObject.call(this, world, config);

	this.playerId = playerId;
	this.life = 1;
	this.damage = 10;
	this.fireTime = (new Date()).getTime();
	this.hitted = false;
	this.exploded = false;
};

Bullet.prototype = Object.create(GameObject.prototype);

Bullet.prototype.fly = function() {

};

Bullet.prototype.explode = function() {
	this.exploded = true;
};

Bullet.prototype.isDead = function() {
	if (this.hitted)
		return true;
	var time = ((new Date()).getTime() - this.fireTime) / 1000;
	return time >= this.life;
};

Bullet.prototype.isExploded = function() {
	return this.exploded;
};

if (module) module.exports = Bullet;