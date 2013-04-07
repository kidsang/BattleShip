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
					that.myShip = ship;
				}
			}
		}

		for (var id in current) {
			var player = that.players[id];
			player.finalize();
			delete that.players[id];
		}
	});

	socket.on(Proto.RESPONSE_SYNC_TIME, function(servTime) {
		var p1 = (new Date()).getTime();
		that.delay = p1 - that._p0;
		that.servTimeDiff = servTime + that.delay / 2 - p1;
		// console.log('delay:' + that.delay);
		// console.log('diff:' + that.servTimeDiff + '\n');
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

	socket.on(Proto.SYNC_KINEMATICS, function(id, action, isActive, pkg) {
		// if (id != that.myid) {
			var ship = players[id].ship;
			ship.applyAction(action, isActive);
			ship.updateKinematicsByPackage(pkg);
		// }
	});

	socket.emit(Proto.PLAYER_JOIN, myname);

	this.syncTimeTimer = setInterval(function() {
		that._p0 = (new Date()).getTime();
		socket.emit(Proto.REQUEST_SYNC_TIME);
	}, 1000);
};

BattleState.prototype.finalizeNetwork = function() {
	// clearInterval(this.syncLoop);
	clearInterval(this.syncTimeTimer);
	this.socket.removeAllListeners();
	delete this.socket;
};
