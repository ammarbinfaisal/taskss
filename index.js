const {createNewTask, listTasks, editTask} = require('./utils');

module.exports = (input, flags) => {
	if (flags.new) {
		createNewTask();
	} else if (flags.edit) {
		editTask(flags.edit);
	} else {
		listTasks();
	}
};
