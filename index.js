const chalk = require('chalk');

const screen = require('./utils/screen');
const { addTask, deleteTask } = require('./lib');
const { newTask, showTasksEditor, listTasks } = require('./ui');

module.exports = async (input, flags) => {
	if (flags.task) {
		const { task, group } = flags;
		addTask(task, group);
		process.exit();
	} else if (flags.new) {
		const { task, group } = await newTask();
		addTask(task, group);
		process.exit();
	} else if (flags.edit) {
		screen.init();
		showTasksEditor(flags.edit);
	} else if (flags.delete) {
		if (!deleteTask(flags.delete)) 
			console.log(chalk.grey('\n:( no task with that index exists.\n'));
		process.exit();
	} else {
		screen.init();
		listTasks();
	}
};
