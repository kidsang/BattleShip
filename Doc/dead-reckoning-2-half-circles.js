
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
var lcx = 200;
var rcx = 200 + 2 * r;
var cx = 200;
var cy = 200;
var arc = new Kinetic.Shape({
	drawFunc: function(canvas) {
		var context = canvas.getContext();
		context.arc(lcx, cy, r, 0, Math.PI, true); 
		context.moveTo(rcx + r, cy);
		context.arc(rcx, cy, r, 0, Math.PI); 
		canvas.fillStroke(this);
	},
	stroke:'black',
	strokeWidth:1
});
layer.add(arc);

var total = 10;
var radStep = 2 * Math.PI / total;
var routeStep = 2 * Math.PI * r / total;
var routePoints = [];

function draw(x, y, rad, revert) {
	var ship = newShip(x, y, (revert ? rad + Math.PI : rad));
	layer.add(ship);
	var dot = newDot(x, y);
	layer.add(dot);

	var tan = (revert ? rad + Math.PI / 2 : rad - Math.PI / 2);
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

// right
for (var i = total / 2; i < total; ++i) {
	var rad = Math.PI + radStep * i;
	var x = Math.cos(rad) * r + rcx;
	var y = Math.sin(rad) * r + cy;
	draw(x, y, rad);
}
// left
for (var i = 0; i < total / 2; ++i) {
	var rad = -radStep * i;
	var x = Math.cos(rad) * r + lcx;
	var y = Math.sin(rad) * r + cy;
	draw(x, y, rad, true);
}

var routeLine = new Kinetic.Line({
	points:routePoints,
	strokeWidth:1,
	dashArray:[7, 3]
});
layer.add(routeLine);

stage.add(layer);
