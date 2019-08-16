const inquirer = require('inquirer');

module.exports = () => {
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
		}
	];

	return inquirer.prompt(questions);
};
