const Configstore = require('configstore');
const chalk = require('chalk');
const datastore = new Configstore('tasks');
const screen = require('../utils/screen');

module.exports = index => {
    index -= 1;
    let tasks = datastore.get('tasks');

    if (typeof tasks[index] !== 'undefined') {
        tasks.splice(index, 1);
        datastore.set('tasks', tasks);
        screen.init();
        console.clear();
        screen.cursorTo((process.stdout.columns - 10) / 2, process.stdout.rows / 3);
        const text = 'DELETED';
        let i = 0;
        setInterval(() => {
            screen.write(chalk.rgb(200, 100, 180).bold(text[i] ? text[i] : '.'));
            i++;
            if (i === 7) screen.cursorTo((process.stdout.columns - 16) / 2, process.stdout.rows / 3 + 1);
        }, 20);
        setTimeout(() => {
            console.clear();
            process.exit();
        }, 20 * 25);
    } else {
        console.log(chalk.grey('\n:( no task with that index exists.\n'));
        process.exit();
    }
};
