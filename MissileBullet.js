if (module) Bullet = require('./Bullet.js');
if (module) Constants = require('./Constants.js');
if (module) Server = require('./Server.js');
if (module) b2Vec2 = require('./Box2dWeb-2.1.a.3.min.js').Common.Math.b2Vec2;

MissileBullet = function(world, playerId, config) {
	config.box = [7 / Constants.drawScale, 3 / Constants.drawScale];
	config.speed = 210 / Constants.drawScale;

	Bullet.call(this, world, playerId, config);

	this.speed = config.speed;
	this.life = 3;
	this.angularVelocity = 6;
};

MissileBullet.prototype = Object.create(Bullet.prototype);

MissileBullet.prototype.fly = function() {
	var nowSec = (new Date()).getTime();
	if (nowSec - this.fireTime > 500) {
		var nearest = this._findNearestShip(Server.players);
		if (nearest)
			this._trace(nearest);
	}
};

MissileBullet.prototype._findNearestShip = function(players) {
	var nearest = null;
	var min = Number.MAX_VALUE;
	var mypos = this.body.GetPosition();
	for (var id in players) {
		if (id == this.playerId)
			continue;
		var ship = players[id].ship;
		var pos = ship.body.GetPosition();

		var dif = Math.pow(pos.x - mypos.x, 2) + Math.pow(pos.y - mypos.y, 2);
		if (dif < min) {
			min = dif;
			nearest = ship;
		}
	}
	return nearest;
};

MissileBullet.prototype._trace = function(ship) {
	var src = this.body.GetPosition();
	var dst = ship.body.GetPosition();
	var vec = b2Vec2.Make(dst.x - src.x, dst.y - src.y)
	var cos = Math.sqrt(vec.x * vec.x) / vec.Length();
	var angle = Math.acos(cos);
	if (vec.y > 0 && vec.x < 0)
		angle = Math.PI - angle;
	else if (vec.y < 0 && vec.x < 0)
		angle += Math.PI;
	else if (vec.y < 0 && vec.x > 0)
		angle = 2 * Math.PI - angle;
	var curAngle = this.body.GetAngle() % (2 * Math.PI);
	var angleDif = curAngle - angle;
	var angleStep = this.angularVelocity / Constants.frameRate;
	if (Math.abs(angleDif) > angleStep)
	{
		if (angleDif > Math.PI)
			angleDif = 2 * Math.PI - angleDif;
		else if (angleDif < -Math.PI)
			angleDif = 2 * Math.PI + angleDif;
		if (angleDif > 0)
			angle = curAngle - angleStep;
		else
			angle = curAngle + angleStep;
	}
	this.body.SetAngle(angle);

	var vx = Math.cos(angle) * this.speed;
	var vy = Math.sin(angle) * this.speed;
	this.body.SetLinearVelocity(new b2Vec2(vx, vy));
};

if (module) module.exports = MissileBullet;