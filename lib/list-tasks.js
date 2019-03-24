const Configstore = require('configstore');
const chalk = require('chalk');
const prepareOutput = require('./prepare-output.js');

const datastore = new Configstore('$_tasks_$');

module.exports = () => {
    const tasks = datastore.get('tasks');
    const grouped = {};
    if (tasks[0]) {
        tasks.forEach(task => {
            if (task) {
                const { group } = task;
                if (group) {
                    if (!grouped[group]) {
                        grouped[group] = [];
                    }
                    delete task.group;
                    grouped[group].push(task);
                }
            }
        });
        console.log(prepareOutput(grouped));
    } else {
        console.log(chalk.grey('\n\t:( There are no tasks currently scheduled.\n'));
    }
};
