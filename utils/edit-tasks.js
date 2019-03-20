const Configstore = require('configstore');
const inquirer = require('inquirer');

const datastore = new Configstore('$_tasks_$');

module.exports = async index => {
	index -= 1;
	const tasks = datastore.get('tasks');
	const task = tasks[index];

	if (task) {
		const questions = [
			{
				type: 'input',
				name: 'task',
				message: 'edit task: ',
				validate: input => /[a-z]/i.test(input),
				default: task.task
			},
			{
				type: 'input',
				name: 'group',
				message: 'group: ',
				default: task.group
			},
			{
				type: 'input',
				name: 'deadline',
				message: 'deadline: ',
				validate: input => /^\dd$/.test(input),
				default: task.deadline
			}
		];
		const editedTasks = await inquirer.prompt(questions);
		tasks[index] = editedTasks;
		datastore.set('tasks', tasks);
	} else {
		console.log(tasks);
	}
};
