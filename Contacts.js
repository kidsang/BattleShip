if (module) Box2D = require('./Box2dWeb-2.1.a.3.min.js');

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
		if (dataA instanceof BombBullet) {
			// bomb will not disappear until it's life's over
			bullet.hitted = false;
		}
		if (dataB) {
			if (dataB instanceof Bullet){
				// bullets will not hit each other
				bullet.hitted = false;
			}
			else if (dataB instanceof Ship) {
				Contacts._bulletHitShip(bullet, dataB);
			}
		}
		return true;
	}

	return false;
};

Contacts.laserCast = function(bullet, world, fromX, fromY, angle, length) {
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var from = new b2Vec2(fromX, fromY);
	var to = new b2Vec2(fromX + Math.cos(angle) * length, fromY + Math.sin(angle) * length);
	var result = world.RayCastAll(from, to);
	result.sort(function(a, b) {
		return a.GetBody().GetPosition().Length() - b.GetBody().GetPosition().Length()
	});
	for (var i = 0; i < result.length; ++i) {
		var fix = result[i];
		var data = fix.userData;
		if (!data)
			return data.GetBody().GetPosition().Length() / length;
		else if (data instanceof Ship) {
			Contacts._bulletHitShip(bullet, data);
		}
	}
	return 1;
};

Contacts.bombCast = function(bullet, world, position, radius) {
	var b2Transform = Box2D.Common.Math.b2Transform;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

	var shape = new b2CircleShape(radius);
	var trans = new b2Transform();
	trans.SetIdentity();
	trans.position.x = position.x;
	trans.position.y = position.y;
	Contacts._bombCastBullet = bullet;
	world.QueryShape(Contacts._bombCastCallback, shape, trans);
};

Contacts._bombCastCallback = function(fix) {
	var data = fix.userData;
	if (data && data instanceof Ship && data.id != Contacts._bombCastBullet.playerId) {
		Contacts._bulletHitShip(Contacts._bombCastBullet, data);
	}
	return true;
};

Contacts._bulletHitShip = function(bullet, ship) {
};

if (module) module.exports = Contacts;