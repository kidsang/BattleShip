if (module) Box2D = require('./Box2dWeb-2.1.a.3.min.js');
if (module) GameObject = require('./GameObject.js');
if (module) Constants = require('./Constants.js');
if (module) Utils = require('./Utils.js');

if (module) Vulcan = require('./Vulcan.js');

// params:config = {
//  color 船的颜色，必须
// }
Ship = function(id, world, config) {
	this.contactGroup = Ship.nextContactGroupIndex;
	Ship.nextContactGroupIndex = (Ship.nextContactGroupIndex - 1) % 10086;
	config.contactGroup = this.contactGroup;
	config.box = [12 / Constants.drawScale, 8 / Constants.drawScale];
	GameObject.call(this, world, config);

	this.color = config.color;
	this.id = id;

	this.maxVelocity = 200 / Constants.drawScale;
	this.minVelocity = 0 / Constants.drawScale;
	this.acceleration = 2.667 / Constants.drawScale;
	this.angularVelocity = 5;

	this.actions = {};
	this.weapons = [];
	this.currentWeaponIndex = 0;
};

Ship.nextContactGroupIndex = -1;

Ship.prototype = Object.create(GameObject.prototype);

Ship.prototype.getKinematicsPackage = function(createTime) {
	var pkg = {};
	// pkg.time = createTime;
	var pos = this.body.GetPosition();
	var toFixed = Utils.toFixed;
	pkg.x = toFixed(pos.x, 2);
	pkg.y = toFixed(pos.y, 2);
	var vel = this.body.GetLinearVelocity();
	pkg.vx = toFixed(vel.x, 2);
	pkg.vy = toFixed(vel.y, 2);
	pkg.angle = toFixed(this.body.GetAngle(), 2);
	pkg.va = toFixed(this.body.GetAngularVelocity(), 2);
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

	// 预测
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
	var va = ta * scale;
	this.body.SetAngularVelocity(va);


	// 保守
	// var lastPos = this.body.GetPosition();
	// var tx = pkg.x - lastPos.x;
	// var ty = pkg.y - lastPos.y;
	// var vx = tx * scale;
	// var vy = ty * scale;
	// this.body.SetLinearVelocity(new b2Vec2(vx, vy));

	// var lastAngle = this.body.GetAngle();
	// var ta = pkg.angle - lastAngle;
	// var va = ta * scale;
	// this.body.SetAngularVelocity(va);

};

Ship.prototype.updateKinematicsByAction = function() {
	var angularVelocity = 0;
	if (this.actions['left']) {
		angularVelocity -= this.angularVelocity;
	}
	if (this.actions['right']) {
		angularVelocity += this.angularVelocity;
	}
	this.body.SetAngularVelocity(angularVelocity);

	var velocity = this.body.GetLinearVelocity().Length();
	if (this.actions['up']) {
		velocity += this.acceleration;
		if (velocity > this.maxVelocity)
			velocity = this.maxVelocity;
	}
	else if (this.actions['down']) {
		velocity -= this.acceleration;
		if (velocity < this.minVelocity)
			velocity = this.minVelocity;
	}

	var angle = this.body.GetAngle();
	var vx = Math.cos(angle) * velocity;
	var vy = Math.sin(angle) * velocity; 
	this.body.SetLinearVelocity(new b2Vec2(vx, vy));
};

Ship.prototype.applyAction = function(action, isActive) {
	this.actions[action] = isActive;
};

Ship.prototype.addWeapon = function(weapon) {
	this.weapons.push(weapon);
};

if (module) module.exports = Ship;