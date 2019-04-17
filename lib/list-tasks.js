const Configstore = require('configstore');
const datastore = new Configstore('tasks');
const chalk = require('chalk');
const cliTruncate = require('cli-truncate');
const log = require('../utils/log');
const edittask = require('./edit-tasks');
const screen = require('../utils/screen');

const display = tasks => {
    let index = 1;
    for (const group in tasks) {
        if (Object.prototype.hasOwnProperty.call(tasks, group)) {
            // GROUP HEADING
            screen.nextLine();
            screen.moveRight(2);
            screen.write(`${chalk.rgb(255, 255, 255)(group)}`);
            screen.nextLine();

            tasks[group].forEach(task => {
                screen.moveRight(2);
                screen.write(`${chalk.grey(index + '.')} ${chalk.rgb(230, 230, 230)(task.task)}`);
                screen.cursorTo(process.stdout.columns - 4);
                if (task.done) screen.write('✔');
                else screen.write('☐');
                screen.nextLine();
                index++;
            });
            screen.moveLeft(2);
        }
    }
};

module.exports = () => {
    const tasks = datastore.get('tasks');
    const _tasks = tasks;
    const grouped = {};
    if (tasks && tasks[0]) {
        console.clear();
        let y = 0;
        const allowedLines = [];
        log(JSON.stringify(allowedLines));
        tasks.forEach(task => {
            if (task) {
                const { group } = task;
                if (group) {
                    if (!grouped[group]) {
                        grouped[group] = [];
                        y += 2;
                    }
                    grouped[group].push(task);
                    allowedLines.push(y);
                    y++;
                }
            }
        });

        screen.init();
        display(grouped);

        let index = 0;
        const arrowTo = newindex => {
            if (typeof newindex === 'number') {
                screen.cursorTo(0, allowedLines[index]);
                screen.write('   '); //clear arow
                screen.cursorTo(0, allowedLines[newindex]);
                screen.write(chalk.green(' =>'));
                index = newindex;
            }
            screen.cursorTo(process.stdout.columns - 1, allowedLines[newindex]);
        };
        arrowTo(0);

        let mode = 'DISPLAY';
        screen.addListener('keypress', (chunk, key) => {
            log(index);
            if (key && key.name === 'up' && mode === 'DISPLAY') {
                arrowTo(index - 1 > -1 ? index - 1 : 0);
            } else if (key && key.name === 'down' && mode === 'DISPLAY') {
                arrowTo(index + 1 < allowedLines.length ? index + 1 : allowedLines.length - 1);
            } else if (key && key.ctrl && key.name === 'c' && mode === 'DISPLAY') {
                console.clear();
                process.exit();
            } else if (key && key.ctrl && key.name === 'd' && mode === 'DISPLAY') {
                _tasks[index]['done'] = !_tasks[index]['done'];
                datastore.set('tasks', _tasks);
                screen.cursorTo(process.stdout.columns - 4);
                // dont know why I have to use ! here but it won't work without it so let it be here
                screen.write(!_tasks[index]['done'] ? '☐' : '✔');
                arrowTo(index); // to reset the cursor
            } else if (key && key.name === 'e' && typeof index === 'number' && mode === 'DISPLAY') {
                mode = 'EDIT';
                edittask(index + 1);
            }
        });

        screen.addListener('resize', () => arrowTo(index));
    } else {
        console.log(chalk.grey('\n\t:( There are no tasks currently scheduled.\n'));
    }
};
