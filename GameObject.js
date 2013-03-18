// if (!Box2D) Box2D = require('./Box2dWeb-2.1.a.3.min.js');
if (module) Box2D = require('./Box2dWeb-2.1.a.3.min.js');

var _fixDef = new Box2D.Dynamics.b2FixtureDef();
_fixDef.density = 1.0;
_fixDef.friction = 0;
_fixDef.restitution = 0;

var _bodyDef = new Box2D.Dynamics.b2BodyDef();

// param:world Box2D world 
// param:config = {
//  static 是否静止物，默认false
//  box[halfWidth, halfHeight] 设置包围盒，与circle属性互斥，必须
//  circle 设置包围球半径，与box属性互斥，必须
//  x x坐标，可选
//  y y坐标，可选
//  angle 弧度制旋转角，可选
// }
GameObject = function(world, config) {
	var b2Body = Box2D.Dynamics.b2Body;
	_bodyDef.type = (config.static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody)
	_bodyDef.position.x = (config.x ? config.x : 0);
	_bodyDef.position.y = (config.y ? config.y : 0);
	_bodyDef.angle = (config.angle ? config.angle : 0);
	this.body = world.CreateBody(_bodyDef);

	_fixDef.shape = undefined;
	if (config.box) {
		_fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
		_fixDef.shape.SetAsBox(config.box[0], config.box[1]);
	}
	else if (config.circle) {
		_fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(config.circle);
	}
	this.body.CreateFixture(_fixDef);

	this.world = world;
};

GameObject.prototype.finalize = function() {
	this.world.DestroyBody(this.body);
}

if (module) module.exports = GameObject;