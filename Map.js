if (module) GameObject = require('./GameObject.js');

Map = function(mapDef, world) {

	for (var i in mapDef) {
		var def = mapDef[i];
		var x = def[0] / Constants.drawScale;
		var y = def[1] / Constants.drawScale;
		var hw = def[2] / Constants.drawScale / 2;
		var hh = def[3] / Constants.drawScale / 2;

		new GameObject(world, {
			type:2,
			box:[hw, hh],
			'x':x+hw,
			'y':y+hh
		})
	}

	var w = Constants.mapWidth / Constants.drawScale;
	var h = Constants.mapHeight / Constants.drawScale;
	var hw = w / 2;
	var hh = h / 2;
	// left
	new GameObject(world, {
		type:2,
		box:[1, hh],
		'y':hh
	})
	// right
	new GameObject(world, {
		type:2,
		box:[1, hh],
		'x':w,
		'y':hh
	})
	// top
	new GameObject(world, {
		type:2,
		box:[hw, 1],
		'x':hw
	})
	// bottom
	new GameObject(world, {
		type:2,
		box:[hw, 1],
		'x':hw,
		'y':h
	})
};

Map.prototype.finalize = function() {

};

if (module) module.exports = Map;