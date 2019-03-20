const inquirer = require('inquirer');
const Configstore = require('configstore');

const datastore = new Configstore('$_tasks_$');

const questions = [
	{
		type: 'input',
		name: 'task',
		message: 'new task: ',
		validate: input => /[a-z]/i.test(input)
	},
	{
		type: 'input',
		name: 'group',
		message: 'group: ',
		default: 'general'
	},
	{
		type: 'input',
		name: 'deadline',
		message: 'deadline: ',
		validate: input => /^\dd$/.test(input)
	}
];

module.exports = async () => {
	const task = await inquirer.prompt(questions);
	let tasks = datastore.get('tasks');
	if (!tasks) {
		tasks = [];
	}
	tasks.push(task);
	datastore.set('tasks', tasks);
};
