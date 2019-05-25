const chalk = require('chalk');

const { createTask, listTasks, editTask, deleteTask } = require('./lib');

module.exports = (input, flags) => {
	if (flags.new) {
		createTask();
	} else if (flags.edit) {
		editTask(flags.edit);
	} else if (flags.delete) {
		if (!deleteTask(flags.delete)) console.log(chalk.grey('\n:( no task with that index exists.\n'));
		process.exit();
	} else {
		listTasks();
	}
};
