Contacts = require('./Contacts.js');

Contacts._bulletHitShip = function(bullet, ship) {
	console.log('hit ship ' + ship.id);
};

module.exports = Contacts;