const Configstore = require('configstore');
const chalk = require('chalk');
const datastore = new Configstore('$_tasks_$');

module.exports = index => {
    index -= 1;
    let tasks = datastore.get('tasks');

    if (typeof tasks[index] !== 'undefined') tasks.splice(index);
    else {
        console.log(chalk.grey('\n:( no task with that index exists.\n'));
    }
    datastore.set('tasks', tasks);
};
