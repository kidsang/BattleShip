MapClient = function(mapDef, world, layer) {
	Map.call(this, mapDef, world);
	
	var w = Constants.mapWidth;
	var h = Constants.mapHeight;
	var s = 5;
	var border = new Kinetic.Line({
		points:[
		s, s,
		s, h-s,
		w-s, h-s,
		w-s, s,
		s, s
		],
		stroke:'#000',
		strokeWidth:1,
		opacity:0.5
	});
	layer.add(border);

	for (var i in mapDef) {
		var def = mapDef[i];
		var x = def[0];
		var y = def[1];
		var w = def[2];
		var h = def[3];
		var t = def[4];

		var obstacle = new Obstacle(w, h, t);
		obstacle.group.setX(x);
		obstacle.group.setY(y);
		layer.add(obstacle.group);

		obstacle.grow();
	}

};

MapClient.prototype = Object.create(Map.prototype);

MapClient.grow = function() {

}; 

Obstacle = function(w, h, t) {
	var group = new Kinetic.Group();
	this.group = group;

	var top = new Kinetic.Rect({
		x:-t/2,
		y:-t,
		width:w,
		height:h,
		fill:'#fff',
		opacity:0.5
	});
	this.top = top;
	group.add(top);

	var bottom = new Kinetic.Polygon({
		points:[
		-t/2, -t+h,
		0, h,
		w, h,
		-t/2+w, -t+h
		],
		fill:'#999',
		opacity:0.5
	});
	this.bottom = bottom;
	group.add(bottom);

	var right = new Kinetic.Polygon({
		points:[
		-t/2+w, -t+h,
		w, h,
		w, 0,
		-t/2+w, -t
		],
		fill:'#666',
		opacity:0.5
	});
	this.right = right;
	group.add(right);

	var border = new Kinetic.Line({
		points:[
		-t/2+w, -t,
		-t/2, -t,
		-t/2, -t+h,
		-t/2+w, -t+h,
		-t/2+w, -t,
		w, 0,
		w, h,
		0, h,
		-t/2, -t+h
		],
		stroke:'#000',
		strokeWidth:1,
		opacity:0.5
	});
	this.border = border;
	group.add(border);

	this.w = w;
	this.h = h;
	this.t = t;
	this.timer = null;
	this.curStep = 0;
	this.totalStep = 60;
};

Obstacle.prototype.grow = function() {
	if (this.timer)
		clearInterval(this.timer)

	this.curStep = 0;
	var that = this;
	this.timer = setInterval(function() {
		++that.curStep;
		if (that.curStep > that.totalStep) {
			clearInterval(that.timer);
			that.timer = null;
		}
		else {
			var w = that.w;
			var h = that.h;
			var percent = that.curStep / that.totalStep;
			var t = that.t * percent;

			that.top.setX(-t/2);
			that.top.setY(-t);

			that.bottom.setPoints([
				-t/2, -t+h,
				0, h,
				w, h,
				-t/2+w, -t+h
				]);

			that.right.setPoints([
				-t/2+w, -t+h,
				w, h,
				w, 0,
				-t/2+w, -t
				]);

			that.border.setPoints([
				-t/2+w, -t,
				-t/2, -t,
				-t/2, -t+h,
				-t/2+w, -t+h,
				-t/2+w, -t,
				w, 0,
				w, h,
				0, h,
				-t/2, -t+h
				]);

			var alpha = percent * 4;
			if (alpha > 1) 
				alpha = 1;
			that.group.setOpacity(alpha);
		}

	}, 1000/60);
}
