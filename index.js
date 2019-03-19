const {createNewTask, listTasks} = require('./utils');

module.exports = (input, flags) => {
	if (flags.new) {
		createNewTask();
	} else {
		listTasks();
	}
};
