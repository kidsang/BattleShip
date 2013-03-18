
var newShip = function(x, y, rotation, dashed) {
	var ship = new Kinetic.Polygon({
		points:[0, -12, -8, 12, 8, 12],
		stroke:'black',
		dashArray:(dashed ? [7, 3] : undefined),
		strokeWidth:'1'
	});
	ship.setX(x);
	ship.setY(y);
	ship.rotate(rotation);
	return ship;
}

var newDot = function(_x, _y) {
	return new Kinetic.Circle({
		x:_x,
		y:_y,
		radius:2,
		fill:'black',
		strokeWidth:0
	});
}

var stage = new Kinetic.Stage({
	container:'canvas',
	width:800,
	height:600
});

var layer = new Kinetic.Layer();

var r = 80;
var cx = 200;
var cy = 200;
var circle = new Kinetic.Circle({
	x:cx,
	y:cy,
	radius:r,
	stroke:'black',
	strokeWidth:1
});
layer.add(circle);

var total = 10;
var radStep = 2 * Math.PI / total;
var routeStep = 2 * Math.PI * r / total;
var routePoints = [];
for (var i = 0; i < total; ++i) {
	var rad = radStep * i;
	var x = Math.cos(rad) * r + cx;
	var y = Math.sin(rad) * r + cy;
	var ship = newShip(x, y, rad);
	layer.add(ship);
	var dot = newDot(x, y);
	layer.add(dot);

	var tan = rad - Math.PI / 2;
	var drx = Math.cos(tan) * routeStep + x;
	var dry = Math.sin(tan) * routeStep + y;
	var drline = new Kinetic.Line({
		points:[x, y, drx, dry],
		strokeWidth:1,
		dashArray:[7, 3, 1, 3]
	});
	layer.add(drline);
	// ship = newShip(drx, dry, rad, true);
	// layer.add(ship);
	var dot = newDot(drx, dry);
	layer.add(dot);

	routePoints.push(drx, dry);
}

var routeLine = new Kinetic.Line({
	points:routePoints,
	strokeWidth:1,
	dashArray:[7, 3]
});
layer.add(routeLine);

stage.add(layer);
