var PlayerClient = function(id, color) {
	Player.call(this, id, color);
}

PlayerClient.prototype = Object.create(Player.prototype);

// var setPlayerCtrl = function(player, ctrl, isActive) {
// 	if (isActive) {
// 		player.ctrls[ctrl] = true;
// 	}
// 	else {
// 		delete player.ctrls[ctrl];
// 	}
// }

// var isPlayerCtrlActive = function(player, ctrl) {
// 	return player.ctrls[ctrl];
// }