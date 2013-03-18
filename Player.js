Player = function(id, color, ship) {
	this.id = id;
	this.color = color;
	this.ship = ship;
};

Player.prototype.finalize = function() {
	this.ship.finalize();
}

module.exports = Player;
