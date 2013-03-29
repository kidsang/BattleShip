BattleState.prototype.initializeNetwork = function() {
	var that = this;
	var socket = this.socket;
	var players = this.players;
	var world = this.world;

	socket.on(Proto.SYNC_PLAYER_LIST, function(playerList) {
		var current = {};
		for (var id in that.players) {
			current[id] = true;
		}

		for (var id in playerList) {
			if (current[id]) {
				delete current[id];
			}
			else {
				var msg = playerList[id];
				var ship = new ShipClient(id, that.world, that.shipLayer, {color:msg.color});
				ship.updateKinematicsByPackage(msg.kinematics);
				ship.addWeapon(new BombClient());
				ship.addWeapon(new LaserClient());
				ship.addWeapon(new MissileClient());
				ship.addWeapon(new VulcanClient());
				var player = new PlayerClient(id, msg.color);
				player.ship = ship;
				that.players[id] = player;
				if (id == that.myid) {
					that.initializeUI();
				}
			}
		}

		for (var id in current) {
			var player = that.players[id];
			player.finalize();
			delete that.players[id];
		}
	});

	socket.on(Proto.FIRE, function(msg) {
		var player = players[msg.id];
		if (!player)
			return;
		var ship = player.ship;
		var weapon = ship.weapons[msg.weapon];
		var bullet = weapon.fire(world,
			that.bulletLayer,
			player.id,
			{
				x:msg.x,
				y:msg.y,
				angle:msg.angle,
				color:ship.color,
				contactGroup:ship.contactGroup
			});
		that.bulletMgr.addBullet(bullet);
	});

	socket.on(Proto.SYNC_POSITIONS, function(shipList) {
		for (var id in shipList) {
			if (id == that.myid)
				continue;
			var player = players[id];
			if (!player)
				continue;
			var ship = player.ship;
			ship.updateKinematicsByPredict(shipList[id]);
		}
	});

	this.syncLoop = setInterval(function(){
		if (!players[that.myid])
			return;
		var ship = players[that.myid].ship;
		var msg = ship.getKinematicsPackage();
		socket.emit(Proto.UPLOAD_POSITION, msg);
	}, 1000/10);

	socket.emit(Proto.PLAYER_JOIN, myname);
};

BattleState.prototype.finalizeNetwork = function() {
	clearInterval(this.syncLoop);
	this.socket.removeAllListeners();
	delete this.socket;
};
