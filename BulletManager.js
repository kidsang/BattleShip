BulletManager = function() {
	this.bullets = [];
};

BulletManager.prototype.finalize = function() {
	for (i in this.bullets) {
		var bullet = this.bullets[i];
		bullet.finalize();
	}
};

BulletManager.prototype.addBullet = function(bullet) {
	this.bullets.push(bullet);
};

BulletManager.prototype.step = function() {
	for (var i = this.bullets.length - 1; i >= 0; --i) {
		var bullet = this.bullets[i];
		if (!bullet.isDead()) {
			bullet.fly();
		}
		else {
			bullet.explode();
		}
		if (bullet.isExploded()) {
			bullet.finalize();
			this.bullets.splice(i, 1);
		}
	}
};

BulletManager.prototype.updateSkin = function() {
	for (var i in this.bullets) {
		var bullet = this.bullets[i];
		bullet.updateSkin();
	}
};

if (module) module.exports = BulletManager;