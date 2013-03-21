if (module) Weapon = require('./Weapon.js');
if (module) VulcanBullet = require('./VulcanBullet.js');

Vulcan = function() {
	Weapon.call(this);

	this.heatGenerated = 5;
	this.fireInterval = 0.05;
	this.name = 'Vulcan';
};

Vulcan.prototype = Object.create(Weapon.prototype);

Vulcan.prototype.fire = function(world, playerId, config) {
	Weapon.prototype.fire.apply(this);
	return new VulcanBullet(world, playerId, config);
};

if (module) module.exports = Vulcan;