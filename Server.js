var FileSystem = require('fs');
var URL = require('url');
var Log = require('./Logger.js');
var Player = require('./Player.js');
var Proto = require('./Proto/Proto.js');
var BattleField = require('./BattleField.js');

var mime = {
	'html':'text/html',
	'css':'text/css',
	'js':'text/javascript',
	'png':'image/png',
	'gif':'image/gif',
	'jpeg':'image/jpeg',
	'jpg':'image/jpeg'
}

var app = require('http').createServer(onHttpRequest);
var io = require('socket.io').listen(app);


var sockets = {};
var players = {};
var battleFields = {};

function start() {
	app.listen(80);
	io.set('log level', 1);
	io.sockets.on('connection', onSocketsConnection);
	Log.info('Battle Ship Game Center started.');
}

function onHttpRequest(request, response) {
	var path = URL.parse(request.url).pathname;

	if (path == '/') {
		path = './Client/index.html';
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
					var ext = path.substr(path.lastIndexOf('.')+1);
					var ct = mime[ext];
					if (!ct)
						ct = 'text/plain';
					response.writeHead(200, {'Content-Type':ct});
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
	socket.on(Proto.CREATE_BATTLE_FIELD, onCreateBattleField);
	socket.on(Proto.REQUEST_BATTLE_FIELD_LIST, onRequestBattleFieldList);
	socket.on(Proto.JOIN_BATTLE_FIELD, onJoinBattleField);
	sockets[socket.id] = socket;
	Log.debug('New connection: ' + socket.id);
}

function onCreateBattleField(msg) {
	console.log(msg);
	var config = {};
	config.name = msg.room;
	config.maxPlayer = msg.numPlayer;
	config.mode = msg.mode;
	switch (msg.obstacle) {
		case '多':
			config.numObstacle = 50;
			break;
		case '少':
			config.numObstacle = 25;
			break;
		default:
			config.numObstacle = 0;
			break;
	}

	var bf = new BattleField(config);
	battleFields[bf.id] = bf;
	this.emit(Proto.CREATE_BATTLE_FIELD_DONE, bf.id);
}

function onRequestBattleFieldList() {

}

function onJoinBattleField(id) {
	var bf = battleFields[id];
	if (bf) {
		bf.newPlayer(this);
	}
	else {
		Log.error('Can not find battle field ' + id);
	}
}

exports.start = start;
