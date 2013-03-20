WeaponTag = function(weapon, x_, y_) {
	this.weapon = weapon;
	this.name = weapon.name;
	this.width = 60;
	this.height = 60;

	var title = new Kinetic.Text({
		x:this.width / 2,
		y:this.height / 2,
		text:this.name,
		fontSize:18,
		fill:'black'
	});
	title.setOffset({
		x:title.getWidth() / 2,
		y:title.getHeight() / 2
	});

	var bg = new Kinetic.Rect({
		width:this.width,
		height:this.height,
		stroke:'black',
		strokeWidth:1,
		fill:'white'
	});

	var cd = new Kinetic.Rect({
		width:this.width,
		height:this.height,
		fill:'red',
		opacity:0.3
	});
	cd.setHeight(0);
	this.cd = cd;

	this.skin = new Kinetic.Group({
		x:x_,
		y:y_
	});
	this.skin.add(bg);
	this.skin.add(title);
	this.skin.add(cd);

};

WeaponTag.prototype.updateSkin = function() {
	var percent = this.weapon.currentHeat / this.weapon.maxHeat;
	var height = percent * this.height;
	var y = this.height - height;
	this.cd.setHeight(height);
	this.cd.setY(y);
};