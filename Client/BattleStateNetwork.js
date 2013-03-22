BS.initializeNetwork = function() {
	// var host = '192.168.0.108';
	var host = '192.168.1.101';
	// var host = '192.168.1.103';
	BS.socket = io.connect(host);
	BS.socket.on('connect', BS.onConnect);
	BS.socket.on('sync time', BS.onSyncTime);
	BS.socket.on('player join', BS.onPlayerJoin);
	BS.socket.on('sync player list', BS.onSyncPlayerList);
	BS.socket.on('sync positions', BS.onSyncPositions)
	BS.socket.on('fire', BS.onFire)
}

BS.finalizeNetwork = function() {
	BS.socket.removeAllListeners();
	delete BS.socket;
}

BS.onConnect = function() {
	BS.lastPingTime = (new Date()).getTime();
	BS.socket.emit('sync time');
}

BS.onSyncTime = function(serverTime) {
	var localTime = (new Date()).getTime();
	var netDelay = localTime - BS.lastPingTime;
	scTimeDiff = serverTime - localTime + netDelay / 2;
	delete BS.lastPingTime;
	BS.socket.emit('player join');
}

BS.onPlayerJoin = function(id) {
	BS.myid = id;
}

BS.onSyncPlayerList = function(playerList) {
	var current = {};
	for (var id in BS.players) {
		current[id] = true;
	}

	for (var id in playerList) {
		if (current[id]) {
			delete current[id];
		}
		else {
			var msg = playerList[id];
			var ship = new ShipClient(id, BS.world, BS.shipLayer, {color:msg.color});
			ship.updateKinematicsByPackage(msg.kinematics);
			ship.addWeapon(new BombClient());
			ship.addWeapon(new LaserClient());
			ship.addWeapon(new MissileClient());
			ship.addWeapon(new VulcanClient());
			var player = new PlayerClient(id, msg.color, ship);
			BS.players[id] = player;
		}
	}

	for (var id in current) {
		var player = BS.players[id];
		player.finalize();
		delete BS.players[id];
	}
}

BS.onSyncPositions = function(shipList) {
	for (var id in shipList) {
		if (id == BS.myid)
			continue;
		var player = BS.players[id];
		if (!player)
			continue;
		var ship = player.ship;
		ship.updateKinematicsByPredict(shipList[id]);
	}
	// console.log((new Date()).getTime());
}

BS.onFire = function(msg) {
	var player = BS.players[msg.id];
	var ship = player.ship;
	var weapon = ship.weapons[msg.weapon];
	var bullet = weapon.fire(BS.world,
		BS.bulletLayer,
		player.id,
		{x:msg.x,
		y:msg.y,
		angle:msg.angle,
		color:ship.color,
		contactGroup:ship.contactGroup});
	BS.bulletMgr.addBullet(bullet);
}
