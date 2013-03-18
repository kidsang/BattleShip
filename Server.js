var FileSystem = require('fs');
var URL = require('url');
var Log = require('./Logger.js');
var Player = require('./Player.js');
var Ship = require('./Ship.js');
var Box2D = require('./Box2dWeb-2.1.a.3.min.js');
var Constants = require('./Constants.js');

var app = require('http').createServer(onHttpRequest);
var io = require('socket.io').listen(app);

var b2Vec2 = Box2D.Common.Math.b2Vec2
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
;
var world = new b2World(new b2Vec2(0, 0), false);

var _colors = ["#0099ff", "#99ff00", "#ff9900", "9900ff", "#ff0099"];
var _nextColor = 0;
function getNextColor() {
	var color = _colors[_nextColor];
	_nextColor = (_nextColor + 1) % _colors.length;
	return color;
}

var players = {};

function start() {
	app.listen(80);
	io.set('log level', 1);
	io.sockets.on('connection', onSocketsConnection);
	setInterval(gameLoop, Constants.frameInterval);
	setInterval(syncPositions, Constants.posSyncInterval);
	Log.info('Battle Ship Server started.');
}

function onHttpRequest(request, response) {
	var clientdir = './Client';
	var path = URL.parse(request.url).pathname;

	if (path == '/') {
		path = clientdir + '/index.html';
	}
	else {
		path = '.' + path;
	}

	FileSystem.exists(path, function(exists) {
		if (exists) {
			FileSystem.readFile(path, function(err, data) {
				if (err) {
					response.writeHead(500);
					response.end(err);
					Log.error('Error loading ' + path + '\n');
				}
				else {
					response.writeHead(200);
					response.end(data);
					Log.debug('Loaded ' + path);
				}
			});
		}
		else {
			response.writeHead(404);
			response.end('Can not find ' + path);
			Log.error('Can not find ' + path);
		}
	});

}

function onSocketsConnection(socket) {
	socket.on('sync time', onSyncTime);
	socket.on('player join', onPlayerJoin);
	socket.on('disconnect', onPlayerLeave);
	socket.on('sync position', onSyncPosition);
	Log.debug('New connection: ' + socket.id);
}

function onSyncTime() {
	this.emit('sync time', (new Date()).getTime());
}

function onPlayerJoin() {
	var clr = getNextColor();
	var ship = new Ship(world, {
		color:clr,
		x:100,
		y:100	
	});
	var player = new Player(this.id, clr, ship);
	player.socket = this;
	players[player.id] = player;
	syncPlayerList();
	player.socket.emit('player join', player.id);
	Log.debug('Player join: ' + player.id);
}

function onPlayerLeave() {
	var player = players[this.id];
	player.finalize();
	delete players[this.id];
	syncPlayerList();
	Log.debug('Player leave: ' + this.id);
}

function syncPlayerList() {
	var playerList = {};
	for (var id in players) {
		var player = players[id];
		var ship = player.ship;
		playerList[id] = {
			color:player.color,
			kinematics:ship.getKinematicsPackage()
		};
	}
	io.sockets.emit('sync player list', playerList);
}

// // function onKeyAction(keyStr, isDown) {
// // 	var player = players[this.id];
// // 	player.setCtrl(keyStr, isDown);
// // 	syncPlayerKeyAction(player.id, keyStr, isDown);
// // 	// syncPosition(player);
// // 	Log.debug('Player:' + player.id + (isDown ? ' key down:' : ' key up:') + keyStr);
// // }

// // function syncPlayerKeyAction(id, ctrlStr, isActive) {
// // 	io.sockets.emit('sync player action', id, ctrlStr, isActive);
// // }

function syncPositions() {
	var msg = {};
	for (var id in players) {
		var player = players[id];
		var ship = player.ship;
		msg[id] = ship.getKinematicsPackage();
	}
	io.sockets.emit('sync positions', msg);
}

function onSyncPosition(msg) {
	var player = players[this.id];
	if (!player)
		return;
	var ship = player.ship;
	// ship.updateKinematicsByPredict(msg);
	ship.updateKinematicsByPackage(msg);
}

// // function syncPosition(player) {
// // 	io.sockets.emit('sync position', player.id, player.ship.getPosition());
// // }

// var lastTime = 0;
// var nowTime = 0;
// var secDiff = 0;

function gameLoop() {

	world.Step(1 / Constants.frameRate, 1, 1);
	world.ClearForces();
// 	nowTime = (new Date()).getTime();
// 	secDiff = (nowTime - lastTime) / 1000;

// 	for (var id in players) {
// 		var player = players[id];
// 		var ship = player.ship;

// 		// if (player.isCtrlActive('left')) {
// 		// 	ship.turnLeft(secDiff);
// 		// }
// 		// else if (player.isCtrlActive('right')) {
// 		// 	ship.turnRight(secDiff);
// 		// }

// 		// if (player.isCtrlActive('up')) {
// 		// 	ship.speedUp(secDiff);
// 		// }
// 		// else if (player.isCtrlActive('down')){
// 		// 	ship.slowDown(secDiff);
// 		// }

// 		// ship.updatePosition(nowTime);
// 	}

// 	lastTime = nowTime;
}

exports.start = start;