if (module) Box2D = require('./Box2dWeb-2.1.a.3.min.js');
if (module) GameObject = require('./GameObject.js');
if (module) Constants = require('./Constants.js');


// params:config = {
//  color 船的颜色，必须
// }
Ship = function(world, config) {
	config.box = [12, 8];
	GameObject.call(this, world, config);

	this.color = config.color;

	this.maxVelocity = 240;
	this.minVelocity = 0;
	this.acceleration = 2.667;
	this.angularVelocity = 5;

	this.actions = {};
};

Ship.prototype = Object.create(GameObject.prototype);

Ship.prototype.getKinematicsPackage = function(createTime) {
	var pkg = {};
	// pkg.time = createTime;
	var pos = this.body.GetPosition();
	pkg.x = pos.x;
	pkg.y = pos.y;
	var vel = this.body.GetLinearVelocity();
	pkg.vx = vel.x;
	pkg.vy = vel.y;
	pkg.angle = this.body.GetAngle();
	pkg.va = this.body.GetAngularVelocity();
	return pkg;
};

Ship.prototype.updateKinematicsByPackage = function(pkg) {
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	this.body.SetPosition(new b2Vec2(pkg.x, pkg.y));
	this.body.SetAngle(pkg.angle);
	this.body.SetLinearVelocity(new b2Vec2(pkg.vx, pkg.vy));
	this.body.SetAngularVelocity(pkg.va);
};

Ship.prototype.updateKinematicsByPredict = function(pkg) {
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var secDiff = Constants.posSyncInterval / 1000.0;
	var scale = 1 / secDiff;

	var lastPos = this.body.GetPosition();
	var px = pkg.x + secDiff * pkg.vx;
	var py = pkg.y + secDiff * pkg.vy;
	var tx = px - lastPos.x;
	var ty = py - lastPos.y;
	var vx = tx * scale;
	var vy = ty * scale;
	this.body.SetLinearVelocity(new b2Vec2(vx, vy));

	var lastAngle = this.body.GetAngle();
	var pa = pkg.angle + secDiff * pkg.va;
	var ta = pa - lastAngle;
	var va = ta % Math.PI * scale;
	this.body.SetAngularVelocity(va);
}

Ship.prototype.applyAction = function(action, isActive) {
	this.actions[action] = isActive;
};

if (module) module.exports = Ship;