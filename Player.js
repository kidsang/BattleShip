Player = function(id, color) {
	this.id = id;
	this.color = color;
	this.ship = null;
};

Player.prototype.finalize = function() {
	if (this.ship)
		this.ship.finalize();
}

if (module) module.exports = Player;
