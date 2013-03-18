
const DEBUG = 0
const INFO = 1
const ERROR = 2
const CURRENT_LEVEL = DEBUG

var trace = function(msg, level) {
	if (level >= CURRENT_LEVEL) {
		console.log(msg);
	}
};

var debug = function(msg) {
	trace('DEBUG: ' + msg, DEBUG);
};

var info = function(msg) {
	trace('INFO: ' + msg, INFO);
};

var error = function(msg) {
	trace('ERROR: ' + msg, ERROR);
};

module.exports = {
	'debug':debug,
	'info':info,
	'error':error
};
