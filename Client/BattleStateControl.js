BattleState.prototype.initializeControl = function() {
	var that = this;
	var ctrl = ['left', 'up', 'right', 'down'];

	Keyboard.onKeyDown(function(event) {
		var ship = that.myShip;
		if (!ship)
			return;

		if (event.keyCode >= 37 && event.keyCode < 41) {
			var ctrlStr = ctrl[event.keyCode - 37];
			that.schedule.addTask(that.nowTime + that.delay / 2, ship, ship.applyAction, [ctrlStr, true]);
			that.socket.emit(Proto.REQUEST_MOVE, ctrlStr, true);
			// ship.applyAction(ctrlStr, true);
			// that.socket.emit(Proto.UPLOAD_KINEMATICS, ctrlStr, true, ship.getKinematicsPackage());
		}

		if (event.keyCode >= 49 && event.keyCode < 49 + ship.weapons.length) {
			var ctrlStr = (event.keyCode - 49).toString();
			ship.applyAction(ctrlStr, true);
			that.socket.emit(Proto.UPLOAD_ACTION, ctrlStr, true);
		};
	});

	Keyboard.onKeyUp(function(event) {
		var ship = that.myShip;
		if (!ship)
			return;

		if (event.keyCode >= 37 && event.keyCode < 41) {
			var ctrlStr = ctrl[event.keyCode - 37];
			that.schedule.addTask(that.nowTime + that.delay / 2, ship, ship.applyAction, [ctrlStr, false]);
			that.socket.emit(Proto.REQUEST_MOVE, ctrlStr, false);
			// ship.applyAction(ctrlStr, false);
			// that.socket.emit(Proto.UPLOAD_KINEMATICS, ctrlStr, false, ship.getKinematicsPackage());
		}

		if (event.keyCode >= 49 && event.keyCode < 49 + ship.weapons.length) {
			var ctrlStr = (event.keyCode - 49).toString();
			ship.applyAction(ctrlStr, false);
			that.socket.emit(Proto.UPLOAD_ACTION, ctrlStr, false);
		};
	});

};

BattleState.prototype.finalizeControl = function() {
	Keyboard.clear();
};
