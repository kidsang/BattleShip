Contacts = {};

Contacts.preSolve = function(contact, oldManifold) {
	var fa = contact.GetFixtureA();
	var fb = contact.GetFixtureB();
	if (!Contacts._preSolve(contact, fa, fb))
		Contacts._preSolve(contact, fb, fa);
};

Contacts._preSolve = function(contact, fixA, fixB) {
	var dataA = fixA.userData;
	var dataB = fixB.userData;
	if (!dataA)
		return false;

	if (dataA instanceof Bullet) {
		var bullet = dataA
		contact.SetEnabled(false);
		bullet.hitted = true;
		if (dataB) {
			if (dataB instanceof Bullet){
				// bullets will not hit each other
				bullet.hitted = false;
			}
			else if (dataB instanceof Ship) {
				Contacts._bulletHitShip(bullet, dataB);
			}
		}
	}

	return true;
};

Contacts._bulletHitShip = function(bullet, ship) {
};

if (module) module.exports = Contacts;