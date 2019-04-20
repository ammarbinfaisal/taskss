const inquirer = require('inquirer');
const Configstore = require('configstore');

const datastore = new Configstore('tasks');

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

module.exports = async () => {
    const task = await inquirer.prompt(questions);
    let tasks = datastore.get('tasks');
    if (!tasks) {
        tasks = [];
    }
    tasks.push(task);
    task.done = false;
    datastore.set('tasks', tasks);
};
