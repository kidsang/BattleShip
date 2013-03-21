if (module) Weapon = require('./Weapon.js');
if (module) BombBullet = require('./BombBullet.js');

Bomb = function() {
	Weapon.call(this);

	this.heatGenerated = 100;
	this.fireInterval = 0.5;
	this.name = 'Bomb';
};

Bomb.prototype = Object.create(Weapon.prototype);

Bomb.prototype.fire = function(world, playerId, config) {
	Weapon.prototype.fire.apply(this);
	return new BombBullet(world, playerId, config);
};

if (module) module.exports = Bomb;