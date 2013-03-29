__deploy = false;

if (process.argv.length > 2) {
	if (process.argv[2] == 'deploy')
		__deploy = true;
}

var server = require('./Server.js');
server.start(__deploy);
