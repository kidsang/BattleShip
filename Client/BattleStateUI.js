
BattleState.prototype.initializeUI = function() {
	this.uiInitialized = true;
	this.lastWeaponIndex = 0;
	this.weaponTags = null;

	var player = this.players[this.myid];
	var ship = player.ship;

	var statusGroup = new Kinetic.Group();
	this.uiLayer.add(statusGroup);
	statusGroup.setScale(0.7, 0.7)
	statusGroup.setX(Constants.stageWidth);

	var x = -50;
	// weapons
	this.weaponTags = new Array(ship.weapons.length);
	for (var i = 0; i < ship.weapons.length; ++i) {
		var ri = ship.weapons.length - i - 1;
		var weapon = ship.weapons[ri];
		var name = null;
		var icon = null;
		if (weapon instanceof Vulcan) {
			name = '火神';
			icon = 'vulcan';
		}
		else if (weapon instanceof Laser) {
			name = '激光';
			icon = 'laser';
		}
		else if (weapon instanceof Bomb) {
			name = '炸弹';
			icon = 'bomb';
		}
		else if (weapon instanceof Missile) {
			name = '导弹';
			icon = 'missile';
		}
		var tag = new WeaponTag(name, Resource.imgs[icon], weapon);
		tag.group.setX(x);
		tag.group.setY(46);
		x -= 100;
		statusGroup.add(tag.group);
		this.weaponTags[ri] = tag;
	}
	this.weaponTags[0].setSelect(true);

	// // shield & armor
	var armor = new HpBar(250, '甲', true);
	x -= 80;
	armor.group.setX(x);
	armor.group.setY(26);
	statusGroup.add(armor.group)

	var shield = new HpBar(250, '盾');
	x -= 280;
	shield.group.setX(x);
	shield.group.setY(26);
	statusGroup.add(shield.group);
};

BattleState.prototype.updateUI = function() {
	if (!this.players[this.myid])
		return;

	var player = this.players[this.myid];
	var ship = player.ship;

	if (ship.currentWeaponIndex != this.lastWeaponIndex) {
		this.weaponTags[this.lastWeaponIndex].setSelect(false);
		this.weaponTags[ship.currentWeaponIndex].setSelect(true);
		this.lastWeaponIndex = ship.currentWeaponIndex;
	}

	for (var i in this.weaponTags) {
		var tag = this.weaponTags[i];
		tag.updateSkin();
	}
};
