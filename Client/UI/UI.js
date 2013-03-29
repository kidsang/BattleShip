// -------------------------------------------
// HexLabel
HexLabel = function(text_, fontSize_, width) {
	var height = 60;
	var hw = width / 2;
	var hh = height / 2;
	var sqrt3 = Math.sqrt(3);
	var points_ = [
			-hw, -hh,
			-hw-hh*sqrt3/3, 0,
			-hw, hh,
			hw, hh,
			hw+hh*sqrt3/3, 0,
			hw, -hh
			];

	this.group = new Kinetic.Group();

	this.fill = new Kinetic.Polygon({
		points:points_,
		fill:'black',
		opacity:0.5
	});
	this.group.add(this.fill);

	this.border = new Kinetic.Polygon({
		points:points_,
		visible:false,
		stroke:'black',
		strokeWidth:2,
		opacity:0.5
	});
	this.group.add(this.border);

	this.text = new Kinetic.Text({
		text:text_,
		fontSize:fontSize_,
		fontFamily:'微软雅黑, 黑体',
		fill:'white'
	});
	this.text.setOffset({x:this.text.getWidth() / 2, y:this.text.getHeight() / 2});
	this.group.add(this.text);

	this.timer = null;
	this.events = {};
};

HexLabel.prototype.finalize = function() {
	if (this.timer)
		clearInterval(this.timer);
}

HexLabel.prototype.show = function(animated) {
	if (!animated) {
		this.border.setVisible(false);
		this.group.setVisible(true);
		this.fill.setScale(1, 1);
		this.fill.setOpacity(0.5);
		this.text.setOpacity(1);
	}
	else {
		this.border.setVisible(true);
		this.group.setVisible(true);
		this.border.setOpacity(0);
		this.fill.setOpacity(0);
		this.text.setOpacity(0);
		this.border.setScale(0, 0);
		this.fill.setScale(0, 0);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._showAnima, 1000 / 60, this)
	}
};

HexLabel.prototype._showAnima = function(host) {
	// 边框
	var borderScale = host.border.getScale().x;
	var borderAlpha = host.border.getOpacity();
	// 放大且淡入10帧
	if (borderScale < 1) {
		borderScale += 0.1;
		if (borderScale > 1)
			borderScale = 1;
		host.border.setScale(borderScale, borderScale);
		host.border.setOpacity(borderScale * 0.5);
	}
	// 淡出10帧
	else if (borderAlpha > 0) {
		borderAlpha -= 0.05;
		host.border.setOpacity(borderAlpha);
		if (borderAlpha < 0)
			host.border.setVisible(false);
	}

	// 填充
	if (borderScale > 0.75) {
		var fillScale = host.fill.getScale().x;
		var fillAlpha = host.fill.getOpacity();
		// 放大且淡入10帧
		if (fillScale < 1) {
			fillScale += 0.1;
			if (fillScale > 1)
				fillScale = 1;
			host.fill.setScale(fillScale, fillScale);
			host.fill.setOpacity(fillScale * 0.5);
		}
		// 文字
		else {
			var textAlpha = host.text.getOpacity();
			// 淡入10帧
			if (textAlpha < 1) {
				textAlpha += 0.1;
				if (textAlpha >= 1) {
					textAlpha = 1;
					host._stopTimer();
					if (host.events['show'])
						host.events['show']();
				}
				host.text.setOpacity(textAlpha);
			}
		}
	}
};

HexLabel.prototype.hide = function(animated) {
	if (!animated) {
		this.group.setVisible(false);
	}
	else {
		this.border.setVisible(false);
		this.group.setVisible(true);
		this.fill.setOpacity(0.5);
		this.text.setOpacity(1);
		this.fill.setScale(1, 1);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._hideAnima, 1000 / 60, this)
	}
};

HexLabel.prototype._hideAnima = function(host) {
	// 文字
	var textAlpha = host.text.getOpacity();
	// 5帧淡出
	if (textAlpha > 0) {
		textAlpha -= 0.1;
		if (textAlpha < 0)
			textAlpha = 0;
		host.text.setOpacity(textAlpha);
	}

	// 填充
	var fillScale = host.fill.getScale().x;
	// 10帧缩小淡出
	if (fillScale > 0) {
		fillScale -= 0.1;
		if (fillScale <= 0) {
			fillScale = 0;
			host._stopTimer();
			host.group.setVisible(false);
			if (host.events['hide'])
				host.events['hide']();
		}
		host.fill.setScale(fillScale, fillScale);
		host.fill.setOpacity(fillScale * 0.5);
	}
};

HexLabel.prototype._stopTimer = function() {
	clearInterval(this.timer);
	this.timer = null;
};

HexLabel.prototype.on = function(event, callback) {
	if (event == 'show' || event == 'hide') {
		this.events[event] = callback;
	}
	else {
		this.group.on(event, callback);
	}
};

HexLabel.prototype.off = function(event) {
	if (event == 'show' || event == 'hide') {
		delete this.events[event];
	}
	else {
		this.group.off(event);
	}
};

// -------------------------------------------
// HexButton
HexButton = function(text_, fontSize_, width) {
	var height = 60;
	var hw = width / 2;
	var hh = height / 2;
	var sqrt3 = Math.sqrt(3);
	var points_ = [
			-hw, -hh,
			-hw-hh*sqrt3/3, 0,
			-hw, hh,
			hw, hh,
			hw+hh*sqrt3/3, 0,
			hw, -hh
			];

	this.group = new Kinetic.Group();

	this.fill = new Kinetic.Polygon({
		points:points_,
		fill:'black',
		opacity:0.5
	});
	this.group.add(this.fill);

	this.border = new Kinetic.Polygon({
		points:points_,
		stroke:'#0099ff',
		strokeWidth:2,
		opacity:0.5
	});
	this.group.add(this.border);

	this.text = new Kinetic.Text({
		text:text_,
		fontSize:fontSize_,
		fontFamily:'微软雅黑, 黑体',
		fill:'white'
	});
	this.text.setOffset({x:this.text.getWidth() / 2, y:this.text.getHeight() / 2});
	this.group.add(this.text);

	var fill = this.fill;
	this.group.on('mouseover', function(){
		fill.setFill('#0099ff');
	});

	this.group.on('mouseout', function(){
		fill.setFill('black');
	});

	this.timer = null;
	this.events = {};
};

HexButton.prototype.finalize = function() {
	if (this.timer)
		clearInterval(this.timer);
}

HexButton.prototype.show = function(animated) {
	if (!animated) {
		this.group.setVisible(true);
		this.border.setScale(1, 1);
		this.border.setOpacity(0.5);
		this.fill.setScale(1, 1);
		this.fill.setOpacity(0.5);
		this.text.setOpacity(1);
	}
	else {
		this.group.setVisible(true);
		this.border.setOpacity(0);
		this.fill.setOpacity(0);
		this.text.setOpacity(0);
		this.border.setScale(0, 0);
		this.fill.setScale(0, 0);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._showAnima, 1000 / 60, this)
	}
};

HexButton.prototype._showAnima = function(host) {
	// 边框
	var borderScale = host.border.getScale().x;
	var borderAlpha = host.border.getOpacity();
	// 放大且淡入10帧
	if (borderScale < 1) {
		borderScale += 0.1;
		if (borderScale > 1)
			borderScale = 1;
		host.border.setScale(borderScale, borderScale);
		host.border.setOpacity(borderScale * 0.5);
	}

	// 填充
	if (borderScale > 0.75) {
		var fillScale = host.fill.getScale().x;
		var fillAlpha = host.fill.getOpacity();
		// 放大且淡入10帧
		if (fillScale < 1) {
			fillScale += 0.1;
			if (fillScale > 1)
				fillScale = 1;
			host.fill.setScale(fillScale, fillScale);
			host.fill.setOpacity(fillScale * 0.5);
		}
		// 文字
		else {
			var textAlpha = host.text.getOpacity();
			// 淡入10帧
			if (textAlpha < 1) {
				textAlpha += 0.1;
				if (textAlpha >= 1) {
					textAlpha = 1;
					host._stopTimer();
					if (host.events['show'])
						host.events['show']();
				}
				host.text.setOpacity(textAlpha);
			}
		}
	}
};

HexButton.prototype.hide = function(animated) {
	if (!animated) {
		this.group.setVisible(false);
	}
	else {
		this.group.setVisible(true);
		this.border.setOpacity(0.5);
		this.border.setScale(1, 1);
		this.fill.setOpacity(0.5);
		this.fill.setScale(1, 1);
		this.text.setOpacity(1);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._hideAnima, 1000 / 60, this)
	}
};

HexButton.prototype._hideAnima = function(host) {
	// 文字
	var textAlpha = host.text.getOpacity();
	// 5帧淡出
	if (textAlpha > 0) {
		textAlpha -= 0.1;
		if (textAlpha < 0)
			textAlpha = 0;
		host.text.setOpacity(textAlpha);
	}

	// 填充和边框
	var fillScale = host.fill.getScale().x;
	// 10帧缩小淡出
	if (fillScale > 0) {
		fillScale -= 0.1;
		if (fillScale <= 0) {
			fillScale = 0;
			host._stopTimer();
			host.group.setVisible(false);
			if (host.events['hide'])
				host.events['hide']();
		}
		host.fill.setScale(fillScale, fillScale);
		host.fill.setOpacity(fillScale * 0.5);
		host.border.setScale(fillScale, fillScale);
		host.border.setOpacity(fillScale * 0.5);
	}
};

HexButton.prototype._stopTimer = function() {
	clearInterval(this.timer);
	this.timer = null;
};

HexButton.prototype.on = function(event, callback) {
	if (event == 'show' || event == 'hide') {
		this.events[event] = callback;
	}
	else {
		this.group.on(event, callback);
	}
};

HexButton.prototype.off = function(event) {
	if (event == 'show' || event == 'hide') {
		delete this.events[event];
	}
	else {
		this.group.off(event);
	}
};

// -------------------------------------------
// HpBar
HpBar = function(width_, text_, revert) {
	var height = 36;
	var hw = width_ / 2;
	var hh = height / 2;
	var sqrt3 = Math.sqrt(3);
	var pad = height * sqrt3 / 3;
	if (revert) {
		var points_ = [
			-hw-pad, -hh,
			-hw, hh,
			hw, hh,
			hw+pad, -hh,
		];

	}
	else {
		var points_ = [
			-hw, -hh,
			-hw-pad, hh,
			hw+pad, hh,
			hw, -hh,
		];
	}

	this.group = new Kinetic.Group();

	var bgWidth = (width_ + 2 * pad) * 2;
	var bgHeight = height;
	this.fill = new Kinetic.Polygon({
		points:points_,
		fillPatternOffset:[bgWidth/4, 0],
		opacity:0.5
	});
	this.group.add(this.fill);
	var fill = this.fill;

	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = bgWidth;
	tempCanvas.height = bgHeight;
	var context = tempCanvas.getContext('2d');
	context.beginPath();
	context.rect(0,0,bgWidth/2,bgHeight);
	context.fillStyle='#fff';
	context.fill();
	context.closePath();
	context.beginPath();
	context.rect(bgWidth/2,0,bgWidth/2,bgHeight);
	context.fillStyle='#f00';
	context.fill();
	context.closePath();

	var bg = new Image();
	bg.onload = function() {
		fill.setFillPatternImage(bg);
	};
	var dataUrl = tempCanvas.toDataURL();
	bg.src = dataUrl;

	this.border = new Kinetic.Polygon({
		points:points_,
		stroke:'black',
		strokeWidth:2,
		opacity:0.5
	});
	this.group.add(this.border);

	this.text = new Kinetic.Text({
		text:'100%'+text_,
		width:width_,
		fontSize:16,
		fontFamily:'微软雅黑, 黑体',
		fill:'black',
		opacity:0.5,
		align:'right'
	});
	this.text.setOffset({x:this.text.getWidth() / 2, y:this.text.getHeight() / 2});
	this.group.add(this.text);

	this.percent = 1;
	this.dstPercent = 1;
	this.step = 0;
	this.bgWidth = bgWidth;
	this.textSubfix = text_;
	this.timer = null;
};

HpBar.prototype.finalize = function() {
	if (this.timer)
		clearInterval(this.timer);
};

HpBar.prototype.setPercent = function(percent, animated) {
	this.dstPercent = percent;
	if (!animated) {
		this.percent = percent;
		this.fill.setFillPatternOffset(this.bgWidth / 4 - (1 - percent) * this.bgWidth / 2, 0);
		this.text.setText(Math.floor(percent * 100) + '%' + this.textSubfix);
	}
	else {
		var diff = this.dstPercent - this.percent;
		if (diff != 0) {
			this.step = diff / 30;
			if (!this.timer) 
				this.timer = setInterval(this._animate, 1000 / 60, this);
		}
	}
};

HpBar.prototype._animate = function(host) {
	var percent = host.percent += host.step;
	if (host.step > 0 && percent > host.dstPercent 
		|| host.step < 0 && percent < host.dstPercent) {
		percent = host.dstPercent;
		clearInterval(host.timer);
		host.timer = null;
	}
	host.fill.setFillPatternOffset(host.bgWidth / 4 - (1 - percent) * host.bgWidth / 2, 0);
	host.text.setText(Math.floor(percent * 100) + '%' + host.textSubfix);
	host.percent = percent;
};

// -------------------------------------------
// Loading
HexLoading = function() {
	this.group = new Kinetic.Group();
	this.hexGroup = new Kinetic.Group();
	this.group.add(this.hexGroup);

	var offset = 60;

	this.stops = [[], []];
	for (var i = 0; i < 3; ++i) {
		var ang = (2 * i + 1) / 3 * Math.PI;
		var vx = Math.cos(ang);
		var vy = Math.sin(ang);
		this.stops[0].push([offset * vx, offset * vy]);
		this.stops[1].push([20 * vx, 20 * vy]);
	}

	this.hexs = [];
	for (var i = 0; i < 3; ++i) {
		var hex = new Kinetic.RegularPolygon({
			x:this.stops[0][i][0],
			y:this.stops[0][i][1],
			sides:6,
			sides:6,
			radius:20,
			rotation:Math.PI/6,
			fill:'0x009900',
			opacity:0.5
		});
		this.hexs.push(hex);
		this.hexGroup.add(hex);
	}

	this.text = new Kinetic.Text({
		text:'45%',
		width:100,
		align:'center',
		fontSize:15,
		fontFamily:'黑体',
		fill:'black',
		opacity:0.8
	});
	this.text.setOffset(50, this.text.getHeight() / 2);
	// this.text.setText('加载中...');
	this.group.add(this.text);

	this.timer = setInterval(this._animate, 1000 / 60, this);
	this.curStep = 1; // [1, 60]
	this.totalStep = 60;
	this.animaDir = 1; // >0:stops[0] to stops[1], <0:stops[1] to stops[0]
	this.rotateStep = Math.PI / 60;

	this.percent = 0;
	this.dstPercent = 0;
	this.percentStep = 0;
};

HexLoading.prototype.finalize = function() {
	if (this.timer)
		clearInterval(this.timer);
};

HexLoading.prototype.setPercent = function(percent) {
	this.dstPercent = percent;
	this.percentStep = (this.dstPercent - this.percent) / 30;
};

HexLoading.prototype._animate = function(host) {
	var percent = host.percent + host.percentStep;
	if (percent > host.dstPercent) {
		percent = host.dstPercent;
	}
	host.percent = percent;

	// color
	var begCol = [0x00, 0x00, 0x00];
	var endCol = [0x00, 0x99, 0xff];
	var colstr = '#';
	for (var i = 0; i < 3; ++i) {
		var col = begCol[i] + (endCol[i] - begCol[i]) * percent;
		var str = Math.floor(col).toString(16);
		if (str.length == 1)
			str = '0' + str;
		colstr += str;
	}

	// hexs move
	// var from = host.animaDir > 0 ? 0 : 1;
	// var to = 1 - from;
	// for (var i = 0; i < 3; ++i) {
	// 	var bx = host.stops[from][i][0];
	// 	var by = host.stops[from][i][1];
	// 	var cx = host.stops[to][i][0] - bx;
	// 	var cy = host.stops[to][i][1] - by;
	// 	var hex = host.hexs[i];
	// 	hex.setX(host._easingFunc(host.curStep, bx, cx, host.totalStep));
	// 	hex.setY(host._easingFunc(host.curStep, by, cy, host.totalStep));
	// 	hex.setFill(colstr);
	// }
	// ++host.curStep;
	// if (host.curStep > 60) {
	// 	host.curStep = 1;
	// 	host.animaDir *= -1;
	// }

	for (var i = 0; i < 3; ++i) {
		var ex = host.stops[1][i][0];
		var ey = host.stops[1][i][1];
		var dx = host.stops[0][i][0] - ex;
		var dy = host.stops[0][i][1] - ey;
		var hex = host.hexs[i];
		hex.setX(dx * (1 - percent) + ex);
		hex.setY(dy * (1- percent) + ey);
		hex.setFill(colstr);
		// hex.setAttr('fill', colstr);
	}

	// rotate
	host.hexGroup.rotate(host.rotateStep);

	// text
	host.text.setText(Math.floor(percent * 100) + '%');
};

HexLoading.prototype._easingFunc = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};

// -------------------------------------------
// TextInput
// @param id
// @param width
// @param fontSize
// @param opacity
// @param align
// @param x
// @param y
TextInput = function(root, config) {
	var input = document.createElement('input');
	this.input = input;
	input.style.position = 'absolute';
	input.type = 'text';
	input.style['font-family'] = '微软雅黑, 黑体';
	if (config.id) input.id = config.id;
	if (config.width) input.style.width = config.width + 'px';
	if (config.maxLength) input.maxLength = config.maxLength;
	if (config.fontSize) input.style['font-size'] = config.fontSize + 'px';
	if (config.align) input.style['text-align'] = config.align;
	if (config.x) input.style['margin-left'] = config.x + 'px';
	if (config.y) input.style['margin-top'] = config.y + 'px';
	if (config.opacity) input.style.opacity = config.opacity;
	if (config.text) input.value = config.text;

	root.appendChild(input);
	this.root = root;
	this.timer = null;
	this.curStep = 1;
	this.events = {};
};

TextInput.prototype.finalize = function() {
	if (this.timer)
		this._stopTimer();
	this.input.parentNode.removeChild(this.input);
};

TextInput.prototype._stopTimer = function() {
	clearInterval(this.timer);
	this.timer = null;
}

TextInput.prototype.setScale = function(x, y) {
	var input = this.input;
	var scaleStr = 'scale(' + x + ',' + y + ')';
	input.style['-webkit-transform'] = 
	input.style['-moz-transform'] = 
	input.style['-ms-transform'] = 
	input.style['-o-transform'] = 
	input.style['transform'] = scaleStr;
};

TextInput.prototype.show = function(animated) {
	var input = this.input;
	input.style.visibility = 'visible';
	if (!animated) {
		this.setScale(1, 1);
	}
	else {
		this.setScale(0, 0);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._showAnima, 1000 / 60, this);
	}
};

TextInput.prototype._showAnima = function(host) {
	var scale = host.curStep / 15;
	++host.curStep;
	if (scale > 1) {
		scale = 1;
		host.curStep = 0;
		host._stopTimer();
		if (host.events['show'])
			host.events['show']();
	}
	host.setScale(scale, scale);
};

TextInput.prototype.hide = function(animated) {
	var input = this.input;
	if (!animated) {
		input.style.visibility = 'hidden';
	}
	else {
		input.style.visibility = 'visible';
		this.setScale(1, 1);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._hideAnima, 1000 / 60, this);
	}

};

TextInput.prototype._hideAnima = function(host) {
	var scale = 1 - host.curStep / 15;
	++host.curStep;
	if (scale < 0) {
		scale = 0;
		host.curStep = 0;
		host.input.style.visibility = 'hidden';
		host._stopTimer();
		if (host.events['hide'])
			host.events['hide']();
	}
	host.setScale(scale, scale);
};

TextInput.prototype.on = function(event, callback) {
	this.events[event] = callback;
};

TextInput.prototype.off = function(event) {
	delete this.events[event];
};

TextInput.prototype.getValue = function() {
	return this.input.value;
};

// -------------------------------------------
// HexSelector
HexSelector = function(titleText) {
	var group = new Kinetic.Group();
	this.group = group;

	var main = new Kinetic.Group();
	group.add(main);

	var border = new Kinetic.RegularPolygon({
		sides:6,
		radius:45,
		rotation:Math.PI/6,
		stroke:'#000',
		strokeWidht:2,
		opacity:0.5
	});
	this.border = border;
	main.add(border);

	var fill = new Kinetic.RegularPolygon({
		sides:6,
		radius:45,
		rotation:Math.PI/6,
		fill:'#000',
		opacity:0.5
	});
	this.fill = fill;
	main.add(fill);

	var title = new Kinetic.Text({
		text:titleText,
		offset:[50, 0],
		y:16,
		width:100,
		align:'center',
		fontSize:18,
		fontFamily:'微软雅黑, 黑体',
		fill:'#fff'
	});
	this.title = title;
	main.add(title);

	var content = new Kinetic.Text({
		text:0,
		width:100,
		align:'center',
		fontSize:30,
		fontFamily:'微软雅黑, 黑体',
		fill:'#fff'
	});
	content.setOffset(50, content.getHeight() / 2);
	this.content = content;
	main.add(content);

	var that = this;

	main.on('mouseover', function() {
		if (that.expanded)
			fill.setFill('#f90');
		else 
			fill.setFill('#09f');
	});

	main.on('mouseout', function() {
		if (that.expanded)
			fill.setFill('#f90');
		else 
			fill.setFill('#000');
	});

	main.on('click', function(event) {
		if (that.expanded) {
			fill.setFill('#09f');
			that.fold(true);
		}
		else {
			fill.setFill('#f90');
			that.unfold(true);
		}
		console.log(event.targetNode);
	});

	this.curIndex = 0;
	this.entries = [];
	this.hexs = [];
	this.timer = null;
	this.foldTimer = null;
	this.events = {};
	this.expanded = false;
};

HexSelector.prototype.finalize = function() {
	if (this.timer)
		this._stopTimer();
	if (this.foldTimer)
		this._stopTimer(true);
};

HexSelector.prototype.addEntry = function(entry) {
	this.entries.push(entry);

	var angle = this.hexs.length * Math.PI / 3 + Math.PI / 6;
	var hex = new Kinetic.Group({
		x:Math.cos(angle) * 86,
		y:Math.sin(angle) * 86,
	});
	this.group.add(hex);
	hex.index = this.hexs.length;
	this.hexs.push(hex);

	var fill = new Kinetic.RegularPolygon({
		sides:6,
		radius:45,
		rotation:Math.PI/6,
		fill:'#000',
		opacity:0.5
	});
	hex.add(fill);
	hex.fill = fill;

	var text = new Kinetic.Text({
		text:entry,
		fontSize:30,
		fontFamily:'微软雅黑, 黑体',
		fill:'#fff'
	})
	text.setOffset(text.getWidth() / 2, text.getHeight() / 2);
	hex.add(text);

	var that = this;
	hex.setListening(true);

	hex.on('mouseover', function() {
		if (this.index != that.curIndex)
			this.fill.setFill('#09f')
	});

	hex.on('mouseout', function() {
		if (this.index != that.curIndex)
			this.fill.setFill('#000')
	});

	hex.on('click', function() {
		if (this.index != that.curIndex)
			that.setIndex(this.index);
		that.fold(true);
	});
};

HexSelector.prototype.setIndex = function(index) {
	this.curIndex = index;
	if (this.group.getVisible()) {
		this.content.setText(this.entries[index]);
	}
};

HexSelector.prototype.getValue = function(index) {
	return this.entries[this.curIndex];
};

HexSelector.prototype._stopTimer = function(fold) {
	if (fold) {
		clearInterval(this.foldTimer)
		this.foldTimer = null;
	}
	else {
		clearInterval(this.timer)
		this.timer = null;
	}
};

HexSelector.prototype.show = function(animated) {
	this.content.setText(this.entries[this.curIndex])
	this.fold();
	this.group.setVisible(true);
	if (!animated) {
		this.border.setVisible(false);
		this.fill.setScale(1, 1);
		this.fill.setOpacity(0.5);
		this.title.setOpacity(1);
		this.content.setOpacity(1);
	}
	else {
		this.border.setVisible(true);
		this.fill.setScale(0, 0);
		this.border.setScale(0, 0);
		this.fill.setOpacity(0);
		this.border.setOpacity(0);
		this.title.setOpacity(0);
		this.content.setOpacity(0);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._showAnima, 1000 / 60, this);
	}
};

HexSelector.prototype._showAnima = function(host) {
	// 边框
	var borderScale = host.border.getScale().x;
	var borderAlpha = host.border.getOpacity();
	// 放大且淡入10帧
	if (borderScale < 1) {
		borderScale += 0.1;
		if (borderScale > 1)
			borderScale = 1;
		host.border.setScale(borderScale, borderScale);
		host.border.setOpacity(borderScale * 0.5);
	}
	// 淡出10帧
	else if (borderAlpha > 0) {
		borderAlpha -= 0.05;
		host.border.setOpacity(borderAlpha);
		if (borderAlpha < 0)
			host.border.setVisible(false);
	}

	// 填充
	if (borderScale > 0.75) {
		var fillScale = host.fill.getScale().x;
		var fillAlpha = host.fill.getOpacity();
		// 放大且淡入10帧
		if (fillScale < 1) {
			fillScale += 0.1;
			if (fillScale > 1)
				fillScale = 1;
			host.fill.setScale(fillScale, fillScale);
			host.fill.setOpacity(fillScale * 0.5);
		}
		// 文字
		else {
			var textAlpha = host.title.getOpacity();
			// 淡入10帧
			if (textAlpha < 1) {
				textAlpha += 0.1;
				if (textAlpha >= 1) {
					textAlpha = 1;
					host._stopTimer();
					if (host.events['show'])
						host.events['show']();
				}
				host.title.setOpacity(textAlpha);
				host.content.setOpacity(textAlpha);
			}
		}
	}
};

HexSelector.prototype.hide = function(animated) {
	if (!animated) {
		this.group.setVisible(false);
	}
	else {
		this.border.setVisible(false);
		this.group.setVisible(true);
		this.fill.setOpacity(0.5);
		this.title.setOpacity(1);
		this.content.setOpacity(1);
		this.fill.setScale(1, 1);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._hideAnima, 1000 / 60, this)
		if (this.expanded)
			this.fold(true);
	}
};

HexSelector.prototype._hideAnima = function(host) {
	// 文字
	var textAlpha = host.title.getOpacity();
	// 5帧淡出
	if (textAlpha > 0) {
		textAlpha -= 0.1;
		if (textAlpha < 0)
			textAlpha = 0;
		host.title.setOpacity(textAlpha);
		host.content.setOpacity(textAlpha);
	}

	// 填充
	var fillScale = host.fill.getScale().x;
	// 10帧缩小淡出
	if (fillScale > 0) {
		fillScale -= 0.1;
		if (fillScale <= 0) {
			fillScale = 0;
			host._stopTimer();
			host.group.setVisible(false);
			if (host.events['hide'])
				host.events['hide']();
		}
		host.fill.setScale(fillScale, fillScale);
		host.fill.setOpacity(fillScale * 0.5);
	}
};

HexSelector.prototype.unfold = function(animated) {
	for (var i in this.hexs) {
		var hex = this.hexs[i];
		hex.setVisible(true);
		if (i == this.curIndex)
			hex.fill.setFill('#f90')
		else 
			hex.fill.setFill('#000')
	}
	if (!animated) {
		for (var i in this.hexs) {
			var hex = this.hexs[i];
			hex.setScale(1, 1);
			hex.setOpacity(1);
		}
	}
	else {
		for (var i in this.hexs) {
			var hex = this.hexs[i];
			hex.setScale(0, 0);
			hex.setOpacity(0);
		}
		if (this.foldTimer)
			this._stopTimer(true);
		this.foldTimer = setInterval(this._unfoldAnima, 1000 / 60, this);
	}
	this.expanded = true;
};

HexSelector.prototype._unfoldAnima = function(host) {
	var alpha = host.hexs[0].getOpacity();
	alpha += 1 / 12;
	if (alpha >= 1) {
		alpha = 1;
		host._stopTimer(true);
		host.expanded = true;
	}

	for (var i = 0; i < host.hexs.length; ++i) {
		var hex = host.hexs[i];
		hex.setOpacity(alpha);
		hex.setScale(alpha, alpha);
	}
};

HexSelector.prototype.fold = function(animated) {
	if (!animated) {
		for (var i in this.hexs) {
			var hex = this.hexs[i];
			hex.setVisible(false);
		}
	}
	else {
		for (var i in this.hexs) {
			var hex = this.hexs[i];
			hex.setVisible(true);
			hex.setScale(1, 1);
			hex.setOpacity(1);
		}
		if (this.foldTimer)
			this._stopTimer(true);
		this.foldTimer = setInterval(this._foldAnima, 1000 / 60, this);
	}
	this.fill.setFill('#000');
	this.expanded = false;
};

HexSelector.prototype._foldAnima = function(host) {
	var alpha = host.hexs[0].getOpacity();
	alpha -= 1 / 12;
	if (alpha <= 0) {
		alpha = 0;
		host._stopTimer(true);
		host.expanded = false;
	}

	for (var i = 0; i < host.hexs.length; ++i) {
		var hex = host.hexs[i];
		hex.setOpacity(alpha);
		hex.setScale(alpha, alpha);
		if (alpha == 0)
			hex.setVisible(false);
	}
};

HexSelector.prototype.on = function(event, callback) {
	if (event == 'show' || event == 'hide') {
		this.events[event] = callback;
	}
	else {
		this.group.on(event, callback);
	}
};

HexSelector.prototype.off = function(event) {
	if (event == 'show' || event == 'hide') {
		delete this.events[event];
	}
	else {
		this.group.off(event);
	}
};

// -------------------------------------------
// WeaponTag
WeaponTag = function(title_, icon_, weapon_) {
	var group = new Kinetic.Group();
	this.group = group;

	var bg = new Kinetic.Polygon({
		points:[
		-38, -45/2,
		-38, 45/2,
		45, 0,
		45 + 100, -Math.sqrt(3) * 100,
		-38 + 100, -45/2 - Math.sqrt(3) * 100
		],
		fill:'#000',
		opacity:0.2
	});
	this.bg = bg;
	group.add(bg);

	var fill = new Kinetic.RegularPolygon({
		sides:6,
		radius:45,
		rotation:Math.PI/6,
		fill:'#000',
		opacity:0.5
	});
	this.fill = fill;
	group.add(fill);

	var text = new Kinetic.Text({
		text:title_,
		offset:[50, 0],
		y:16,
		width:100,
		align:'center',
		fontSize:18,
		fontFamily:'微软雅黑, 黑体',
		fill:'#fff'
	});
	this.text = text;
	group.add(text);

	var icon = new Kinetic.Image({
		image:icon_,
		offset:[20, 30]
	});
	this.icon = icon;
	group.add(icon);

	var maskGroup = new Kinetic.Group();
	group.add(maskGroup);
	maskGroup.setClipFunc(function(canvas) {
		var r = 45;
		var hr = r / 2;
		var r3 = r * Math.sqrt(3) / 2;
		var c = canvas.getContext();
		c.beginPath();
		c.moveTo(r, 0);
		c.lineTo(hr, -r3);
		c.lineTo(-hr, -r3);
		c.lineTo(-r, 0);
		c.lineTo(-hr, r3);
		c.lineTo(hr, r3);
		c.closePath();
	});

	var mask = new Kinetic.Rect({
		width:90,
		height:78,
		offset:[45, 39],
		y:78,
		fill:'#f00',
		opacity:0.5
	});
	this.mask = mask;
	maskGroup.add(mask);

	this.timer = null;
	this.weapon = weapon_;
};

WeaponTag.prototype.finalize = function() {
	if (this.timer)
		clearInterval(this.timer);
}

WeaponTag.prototype.show = function(animated) {
	this.group.setVisible(true);
	if (!animated) {
		this.group.setScale(1, 1);
		this.group.setOpacity(1);
	}
	else {
		this.group.setScale(0, 0);
		this.group.setOpacity(0);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._showAnima, 1000 / 60, this)
	}
};

WeaponTag.prototype._showAnima = function(host) {
	var scale = host.group.getScale().x;
	scale += 0.1;
	if (scale >= 1) {
		scale = 1;
		host._stopTimer();
	}
	host.group.setScale(scale, scale);
	host.group.setOpacity(scale);
};

WeaponTag.prototype.hide = function(animated) {
	if (!animated) {
		this.group.setVisible(false);
	}
	else {
		this.group.setVisible(true);
		this.group.setScale(1, 1);
		this.group.setOpacity(1);
		if (this.timer)
			this._stopTimer();
		this.timer = setInterval(this._hideAnima, 1000 / 60, this)
	}
};

WeaponTag.prototype._hideAnima = function(host) {
	var scale = host.group.getScale().x;
	scale -= 0.1;
	if (scale <= 0) {
		scale = 0;
		host._stopTimer();
		host.group.setVisible(false);
	}
	host.group.setScale(scale, scale);
	host.group.setOpacity(scale);
};

WeaponTag.prototype._stopTimer = function() {
	clearInterval(this.timer);
	this.timer = null;
};

WeaponTag.prototype.updateSkin = function() {
	if (!this.weapon)
		return;
	var percent = this.weapon.currentHeat / this.weapon.maxHeat;
	var y = 78 * (1 - percent);
	this.mask.setY(y);
};

WeaponTag.prototype.setSelect = function(selected) {
	if (selected) {
		this.fill.setFill('#09f');
		this.bg.setFill('#09f');
	}
	else {
		this.fill.setFill('#000');
		this.bg.setFill('#000');
	}
};
