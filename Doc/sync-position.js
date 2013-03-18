function newArrowLine(fromX, fromY, toX, toY, dashed) {
	var tx = toX - fromX;
	var ty = toY - fromY;
	var length = Math.sqrt(tx * tx + ty * ty);
	var angle = Math.acos(tx / length);

	var line = new Kinetic.Line({
		dashArray:(dashed ? [4, 2] : undefined),
		points:[fromX, fromY, toX, toY],
		stroke:'black',
		strokeWidth:1
	});

	var arrow = new Kinetic.Line({
		points:[-8, -5, 0, 0, -8, 5],
		stroke:'black',
		strokeWidth:1
	});
	arrow.setRotation(angle);
	arrow.setX(toX);
	arrow.setY(toY);

	// return line;
	var group = new Kinetic.Group({});
	group.add(line);
	group.add(arrow);
	return group;
}

var stage = new Kinetic.Stage({
	container:'canvas',
	width:800,
	height:600
});

var layer = new Kinetic.Layer();

var posX = 50;
var posY = 30;
var gap = 150;
var poles = [posX, posX + gap, posX + gap * 2];
var height = 200;
for (var i = 0; i < 3; ++i) {
	var x = posX + i * gap;
	var line = new Kinetic.Line({
		points:[x, posY, x, posY + height],
		stroke:'black',
		strokeWidth:1
	});
	layer.add(line);
}

for (var i = 0; i < 3; ++i) {
	var str;
	if (i == 0)
		str = 'ClientA';
	else if (i == 1)
		str = 'Server';
	else
		str = 'ClientB'
	var text = new Kinetic.Text({
		text:str,
		x:posX + i * gap,
		y:0,
		fontSize:22,
		fill:'black'
	});
	text.setOffset({x:text.getWidth() / 2});
	layer.add(text);
}

var tp = new Kinetic.TextPath({
	x: 70,
	y: 40,
	fill: 'black',
	fontSize: '12',
	text: "clientA's position",
	data: 'M0,0 L150,30'
});
layer.add(tp);
var al = newArrowLine(poles[0], 50, poles[1], 80, true);
layer.add(al);

var tp = new Kinetic.TextPath({
	x: 220,
	y: 50,
	fill: 'black',
	fontSize: '12',
	text: "clientB's position",
	data: 'M0,30 L150,0'
});
layer.add(tp);
var al = newArrowLine(poles[2], 70, poles[1], 100, true);
layer.add(al);

var tp = new Kinetic.TextPath({
	x: 60,
	y: 114,
	fill: 'black',
	fontSize: '12',
	text: "all clients' positions",
	data: 'M0,30 L150,0'
});
layer.add(tp);
var al = newArrowLine(poles[1], 130, poles[0], 160, true);
layer.add(al);

var tp = new Kinetic.TextPath({
	x: 210,
	y: 120,
	fill: 'black',
	fontSize: '12',
	text: "all clients' positions",
	data: 'M0,0 L150,30'
});
layer.add(tp);
var al = newArrowLine(poles[1], 130, poles[2], 160, true);
layer.add(al);


stage.add(layer);
