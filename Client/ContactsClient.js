Contacts._bulletHitShip = function(bullet, ship) {
	// console.log('hit ship ' + ship.id);
	// var ani = new Explode(p.x * Constants.drawScale, p.y * Constants.drawScale);
	// BS.bulletLayer.add(ani.skin);
	// Contacts.push(ani);
	var pos = ship.body.GetPosition();
	BS.explodeMgr.createExplode(pos.x, pos.y);
};

Contacts.explodes = [];
