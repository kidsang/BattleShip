if (module) Constants = require('./Constants.js');

Weapon = function() {
	this.maxHeat = 100;
	this.coldDownSpeed = 20;
	this.currentHeat = 0;
	this.lastFireTime = 0;

	this.heatGenerated = 0;
	this.fireInterval = 0;
}

Weapon.prototype.canFire = function() {
	if (this.heatGenerated + this.currentHeat > this.maxHeat)
		return false;

	var nowTime = (new Date()).getTime();
	var passedTime = (nowTime - this.lastFireTime) / 1000.0;
	if (passedTime < this.fireInterval)
		return false;

	return true;
}

Weapon.prototype.fire = function() {
	this.lastFireTime = (new Date()).getTime();
	this.currentHeat += this.heatGenerated;
}

Weapon.prototype.coldDown = function() {
	this.currentHeat -= 1 / Constants.frameRate * this.coldDownSpeed;
	if (this.currentHeat < 0)
		this.currentHeat = 0;
}

if (module) module.exports = Weapon;