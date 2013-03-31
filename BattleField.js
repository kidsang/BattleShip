var Server = require('./Server.js');
var Log = require('./Logger.js');
var Player = require('./Player.js');
var Ship = require('./Ship.js');
var Box2D = require('./Box2dWeb-2.1.a.3.min.js');
var Constants = require('./Constants.js');
var ContactsServer = require('./ContactsServer');
var Vulcan = require('./Vulcan.js');
var Missile = require('./Missile.js');
var Laser = require('./Laser.js');
var Bomb = require('./Bomb.js');
var BulletManager = require('./BulletManager.js');
var Proto = require('./Proto/Proto.js');
var MapGen = require('./MapGen.js');
var Map = require('./Map.js');

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

// @param name
// @param maxPlayer
// @param numObstacle
// @param mode
BattleField = function(config) {
	this.id = BattleField._getNextId();
	this.name = config.name;
	this.maxPlayer = config.maxPlayer;
	this.mode = config.mode;
	this.obstacle = config.obstacle;
	switch (config.obstacle) {
		case '多':
			this.numObstacle = 50;
			break;
		case '少':
			this.numObstacle = 25;
			break;
		default:
			this.numObstacle = 0;
			break;
	}
	this.numPlayer = 0;
	this.players = {};
	this.bulletMgr = new BulletManager();
	this.mapSeed = Math.floor(Math.random() * 10086).toString();

	var world = new b2World(new b2Vec2(0, 0), false);
	this.world = world;
	world.SetContactListener({
		BeginContact:function(){},
		EndContact:function(){},
		PreSolve:ContactsServer.preSolve,
		PostSolve:function(){}
	});

	var mapDef = MapGen.gen(this.mapSeed, this.numObstacle);
	var map = new Map(mapDef, world);

	var that = this;
	this.mainLoop = setInterval(function(){that.step()}, 1000 / 60);
};

BattleField.prototype.finalize = function() {
	clearInterval(this.mainLoop);
	this.bulletMgr.finalize();
	delete this.world;
	// for (var id in this.players) {
	// 	var player = this.players[id];
	// 	player.finalize();
	// 	var socket = player.socket;
	// 	// socket.off
	// }
};

BattleField.prototype.newPlayer = function(socket) {
	var that = this;
	var players = this.players;
	var world = this.world;

	var color = BattleField._getNextColor();
	var ship = new Ship(socket.id, world, {
		color:color,
		x:100 / Constants.drawScale,
		y:100 / Constants.drawScale
	});
	ship.addWeapon(new Bomb());
	ship.addWeapon(new Laser());
	ship.addWeapon(new Missile());
	ship.addWeapon(new Vulcan());

	var player = new Player(socket.id, color);
	player.socket = socket;
	player.ship = ship;
	players[player.id] = player;

	socket.on(Proto.PLAYER_JOIN, function(playerName) {
		var player = players[this.id];
		player.name = playerName;
		that.syncPlayerList();
	});

	socket.on(Proto.REQUEST_FIRE, function(msg) {
		var player = players[this.id];
		var ship = player.ship;
		var weapon = ship.weapons[msg.weapon];
		if (weapon.canFire()) {
			var bullet = weapon.fire(world, player.id, {
				x:msg.x,
				y:msg.y,
				angle:msg.angle,
				contactGroup:ship.contactGroup
			});
			that.bulletMgr.addBullet(bullet);
			msg.id = this.id;
			that.broadcast(Proto.FIRE, msg);
		}

	});

	socket.on(Proto.UPLOAD_POSITION, function(msg) {
		var player = players[this.id];
		if (!player)
			return;
		var ship = player.ship;
		ship.updateKinematicsByPredict(msg);

		var shipList = {};
		shipList[this.id] = msg;
		that.broadcast(Proto.SYNC_POSITIONS, shipList);
	});

	socket.emit(Proto.NEW_JOIN, player.id, this.mapSeed, this.numObstacle);

	++this.numPlayer;
	Log.debug('player: ' + player.id + ' join battle field ' + this.id);
};

BattleField.prototype.playerLeave = function(id) {
	var player = this.players[id];
	var socket = player.socket;
	socket.removeAllListeners(Proto.PLAYER_JOIN);
	socket.removeAllListeners(Proto.REQUEST_FIRE);
	socket.removeAllListeners(Proto.UPLOAD_POSITION);
	player.finalize();
	delete this.players[id];
	--this.numPlayer;
	Log.debug('Player leave: ' + this.id);

	if (this.numPlayer == 0)
		Server.destroyBattleField(this.id);
	else
		this.syncPlayerList();
};

BattleField._getNextId = function() {
	if (!BattleField._nextId)
		BattleField._nextId = 0;
	return BattleField._nextId++;
};

BattleField._getNextColor = function() {
	if (!BattleField._colors) {
		BattleField._colors = ["#0099ff", "#99ff00", "#ff9900", "9900ff", "#ff0099", "#00ff99"];
		BattleField._nextColorIndex = 0;
	}
	var color = BattleField._colors[BattleField._nextColorIndex];
	BattleField._nextColorIndex = (BattleField._nextColorIndex + 1) % BattleField._colors.length;
	return color;
};

BattleField.prototype.broadcast = function() {
	for (var id in this.players) {
		var socket = this.players[id].socket;
		socket.emit.apply(socket, arguments);
	}
};

BattleField.prototype.syncPlayerList = function() {
	var playerList = {};
	for (var id in this.players) {
		var player = this.players[id];
		var ship = player.ship;
		playerList[id] = {
			color:player.color,
			kinematics:ship.getKinematicsPackage()
		};
	}
	this.broadcast(Proto.SYNC_PLAYER_LIST, playerList);
}

BattleField.prototype.step = function() {
	this.bulletMgr.step();

	for (var id in this.players) {
		var ship = this.players[id].ship;
		for (var i in ship.weapons) {
			var weapon = ship.weapons[i];
			weapon.coldDown();
		}
	}

	this.world.Step(1 / Constants.frameRate, 1, 1);
	this.world.ClearForces();
}

module.exports = BattleField;