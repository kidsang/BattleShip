BombClient = function() {
	Bomb.call(this);
};

BombClient.prototype = Object.create(Bomb.prototype);

BombClient.prototype.fire = function(world, layer, playerId, config) {
	Weapon.prototype.fire.apply(this);
	return new BombBulletClient(world, layer, playerId, config);
};