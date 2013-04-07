Schedule = function() {
	this.tasks = [];
};

Schedule._makeTask = function(time, that, task, args) {
	var s = {};
	s.time = time;
	s.that = that;
	s.task = task;
	s.args = args;
	return s;
};

Schedule.prototype.addTask = function(time, that, task, args) {
	if (this.tasks.length == 0 || this.tasks[0].time >= time) {
		this.tasks.unshift(Schedule._makeTask.apply(this, arguments));
	}
	else {
		for (var i = this.tasks.length - 1; i >= 0; --i) {
			if (this.tasks[i].time < time) {
				this.tasks.splice(i+1, 0, Schedule._makeTask.apply(this, arguments));
				break;
			}
		}
	}
};

Schedule.prototype.start = function() {
	var tasks = this.tasks;
	var begin = (new Date()).getTime();
	var timer = setInterval(function() {
		var time = (new Date()).getTime() - begin;
		while (true) {
			if (tasks.length == 0) {
				clearInterval(timer);
				break;
			}
			else if (time < tasks[0].time) {
				break;
			}
			else {
				var t = tasks[0];
				t.task.apply(t.that, t.args);
				tasks.splice(0, 1);
			}
		}
	}, 1000 / 30);
};

Schedule.prototype.step = function(time) {
	var tasks = this.tasks;
	while (true) {
		if (tasks.length == 0 || time < tasks[0].time) {
			break;
		}
		else {
			var t = tasks[0];
			t.task.apply(t.that, t.args);
			tasks.splice(0, 1);
		}
	}
};