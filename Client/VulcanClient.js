VulcanClient = function() {
	Vulcan.call(this);
}

VulcanClient.prototype = Object.create(Vulcan.prototype);

VulcanClient.prototype.fire = function(world, layer, playerId, config) {
	Weapon.prototype.fire.apply(this);
	return new VulcanBulletClient(world, layer, playerId, config);
}