
BattleState.prototype.initializeUI = function() {
	this.uiInitialized = true;
	this.lastWeaponIndex = 0;
	this.weaponTags = null;
	this.uiSchedule = new Schedule();

	var player = this.players[this.myid];
	var ship = player.ship;

	var statusGroup = new Kinetic.Group();
	this.uiLayer.add(statusGroup);
	statusGroup.setScale(0.7, 0.7)
	statusGroup.setX(Constants.stageWidth);

	var x = -50;
	var showTime = 0;
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
		tag.hide();
		statusGroup.add(tag.group);
		this.weaponTags[ri] = tag;
		x -= 100;

		this.uiSchedule.addTask(showTime, tag, tag.show, [true]);
		showTime += 100;
	}

	// // shield & armor
	var armor = new HpBar(250, '甲', true);
	x -= 80;
	armor.group.setX(x);
	armor.group.setY(26);
	armor.hide();
	statusGroup.add(armor.group)
	this.uiSchedule.addTask(showTime, armor, armor.show);
	showTime += 100;

	var shield = new HpBar(250, '盾');
	x -= 280;
	shield.group.setX(x);
	shield.group.setY(26);
	shield.hide();
	statusGroup.add(shield.group);
	this.uiSchedule.addTask(showTime, shield, shield.show);
	showTime += 100;

	this.uiSchedule.start();
};

BattleState.prototype.updateUI = function() {
	if (!this.players[this.myid])
		return;

	var player = this.players[this.myid];
	var ship = player.ship;

	for (var i = 0; i < ship.weapons.length; ++i) {
		if (ship.actions[i.toString()])
			this.weaponTags[i].setSelect(true);
		else 
			this.weaponTags[i].setSelect(false);
	}

	for (var i in this.weaponTags) {
		var tag = this.weaponTags[i];
		tag.updateSkin();
	}
};
