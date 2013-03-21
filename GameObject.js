if (module) Box2D = require('./Box2dWeb-2.1.a.3.min.js');

var _fixDef = new Box2D.Dynamics.b2FixtureDef();
_fixDef.density = 1.0;
_fixDef.friction = 0;
_fixDef.restitution = 1;

var _bodyDef = new Box2D.Dynamics.b2BodyDef();

// param:world Box2D world 
// param:config = {
//  type 0是dynamic, 1是kinematic, 2是static, 默认为0
//  box[halfWidth, halfHeight] 设置包围盒，与circle属性互斥，必须
//  circle 设置包围球半径，与box属性互斥，必须
//  x x坐标，可选
//  y y坐标，可选
//  angle 弧度制旋转角，可选
//  vx x方向速度，可选
//  vy y方向速度，可选
//  va 旋转速度，可选
//  contactGroup 位于同一组的物体不会执行碰撞检测，可选
// }
GameObject = function(world, config) {
	var b2Body = Box2D.Dynamics.b2Body;
	if (!config.type || config.type == 0)
		_bodyDef.type = b2Body.b2_dynamicBody;
	else if (config.type == 1)
		_bodyDef.type = b2Body.b2_kinematicBody
	else
		_bodyDef.type = b2Body.b2_staticBody;
	_bodyDef.position.x = (config.x ? config.x : 0);
	_bodyDef.position.y = (config.y ? config.y : 0);
	_bodyDef.angle = (config.angle ? config.angle : 0);
	_bodyDef.linearVelocity.x = (config.vx ? config.vx : 0);
	_bodyDef.linearVelocity.y = (config.vy ? config.vy : 0);
	_bodyDef.angularVelocity = (config.va ? config.va : 0);
	this.body = world.CreateBody(_bodyDef);

	_fixDef.shape = undefined;
	if (config.box) {
		_fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
		_fixDef.shape.SetAsBox(config.box[0], config.box[1]);
	}
	else if (config.circle) {
		_fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(config.circle);
	}
	var fix = this.body.CreateFixture(_fixDef);
	fix.userData = this;

	if (config.contactGroup) {
		var b2FilterData = Box2D.Dynamics.b2FilterData;
		var data = new b2FilterData();
		data.groupIndex = config.contactGroup;
		fix.SetFilterData(data);
	}

	this.world = world;
	this.finalized = false;
};

GameObject.prototype.finalize = function() {
	this.world.DestroyBody(this.body);
	this.finalized = true;
}

if (module) module.exports = GameObject;