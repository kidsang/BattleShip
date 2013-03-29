stage = new Kinetic.Stage({
	container:'canvas',
	width:Constants.stageWidth,
	height:Constants.stageHeight
});
document.getElementById('canvas').getElementsByTagName('div')[0].style.position = 'absolute';

setInterval(_mainLoop, 1000 / 60);

_currentState = null;

function _mainLoop() {
	if (_currentState)
		_currentState.step();
	// stage.draw();
}

function jumpTo(state, msg) {
	if (_currentState)
		_currentState.finalize();
	_currentState = state ? new state(msg) : null;
}

myname = '玩家';
