var Keyboard = {

	onKeyDown:function(callback) {
		Keyboard._onDownEvents[callback] = callback;
	},

	onKeyUp:function(callback) {
		Keyboard._onUpEvents[callback] = callback;
	},

	offKeyDown:function(callback) {
		delete Keyboard._onDownEvents[callback];
	},

	offKeyUp:function(callback) {
		delete Keyboard._onUpEvents[callback];
	},

	clear:function() {
		var key = null;
		for (key in Keyboard._onDownEvents)
			delete Keyboard._onDownEvents[key];
		for (key in Keyboard._onUpEvents)
			delete Keyboard._onUpEvents[key];
	},

	initKeyboard:function() {
		document.onkeydown = Keyboard._keyDown;
		document.onkeyup = Keyboard._keyUp;
	},

	_keyDown:function(event) {
		if (!Keyboard._keys[event.keyCode]) {
			Keyboard._keys[event.keyCode] = true;
			for (var key in Keyboard._onDownEvents) {
				Keyboard._onDownEvents[key](event);
			}
		}
	},

	_keyUp:function(event) {
		if (Keyboard._keys[event.keyCode]) {
			delete Keyboard._keys[event.keyCode];
			for (var key in Keyboard._onUpEvents) {
				Keyboard._onUpEvents[key](event);
			}
		}
	},

	_keys:{},
	_onDownEvents:{},
	_onUpEvents:{}
};

Keyboard.initKeyboard();