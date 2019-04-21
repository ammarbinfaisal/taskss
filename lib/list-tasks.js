const Configstore = require('configstore');
const datastore = new Configstore('tasks');
const chalk = require('chalk');
const log = require('../utils/log');
const edittask = require('./edit-tasks');
const deletetask = require('./delete-task');
const screen = require('../utils/screen');

const allowedLines = [];
const lineMapppedToIndex = {};

const display = tasks => {
    let index = 1;
    for (const group in tasks) {
        if (Object.prototype.hasOwnProperty.call(tasks, group)) {
            screen.nextLine();
            screen.moveRight(4);
            screen.write(`${chalk.white.bold(group)}`);
            screen.nextLine();

            tasks[group].forEach(task => {
                screen.write(`${chalk.grey(task.index + 1 + '.')} ${chalk.rgb(200, 200, 200)(task.task)}`);
                let _x = screen.getX(),
                    _y = screen.getY();
                allowedLines.push(_y);
                lineMapppedToIndex[`${_y}`] = task.index;
                screen.cursorTo(process.stdout.columns - 4);
                if (task.done) screen.write(chalk.green.bold('✔'));
                else screen.write(chalk.green.bold('☐'));
                screen.cursorTo(_x);
                screen.nextLine();
                index++;
            });

            screen.moveLeft(4);
        }
    }
};

module.exports = () => {
    const tasks = datastore.get('tasks');
    const _tasks = tasks;
    const grouped = {};
    if (tasks && tasks[0]) {
        screen.init();
        screen.clear();
        let y = 0;
        log(JSON.stringify(allowedLines));
        tasks.forEach((task, i) => {
            if (task) {
                const { group } = task;
                if (group) {
                    if (!grouped[group]) {
                        log(JSON.stringify(grouped));
                        grouped[group] = [];
                    }
                    task.index = i;
                    grouped[group].push(task);
                }
            }
        });
        display(grouped);

        let index = 0;
        const arrowTo = newindex => {
            if (typeof newindex === 'number') {
                screen.cursorTo(0, allowedLines[index]);
                screen.write('   '); //clear arow
                screen.cursorTo(0, allowedLines[newindex]);
                screen.write(chalk.cyan.bold(' =>'));
                index = newindex;
            }
            screen.cursorTo(process.stdout.columns - 1, allowedLines[newindex]);
        };
        arrowTo(0);

        let mode = 'DISPLAY'; // mode so that this event listener in spite of still being present doesn't work - those if conditions fail.
        screen.addListener('keypress', (chunk, key) => {
            log(index);
            if (key && key.name === 'up' && mode === 'DISPLAY') {
                arrowTo(index - 1 > -1 ? index - 1 : 0);
            } else if (key && key.name === 'down' && mode === 'DISPLAY') {
                arrowTo(index + 1 < allowedLines.length ? index + 1 : allowedLines.length - 1);
            } else if (key && key.ctrl && key.name === 'c' && mode === 'DISPLAY') {
                console.clear();
                process.exit();
            } else if (key && key.name === 't' && mode === 'DISPLAY') {
                _tasks[index]['done'] = !_tasks[index]['done'];
                datastore.set('tasks', _tasks);
                screen.cursorTo(process.stdout.columns - 4); // dont know why I have to use ! here but it won't work without it so let it be here
                screen.write(chalk.green.bold(!_tasks[index]['done'] ? '☐' : '✔'));
                arrowTo(index); // to reset the cursor
            } else if (key && key.name === 'd' && mode === 'DISPLAY') {
                deletetask(lineMapppedToIndex[`${screen.getY()}`] + 1);
            } else if (key && key.name === 'e' && typeof index === 'number' && mode === 'DISPLAY') {
                mode = 'EDIT';
                edittask(lineMapppedToIndex[`${screen.getY()}`] + 1);
            }
        });

        screen.addListener('resize', () => {
            log('hello');
            console.clear();
            display();
        });
    } else {
        console.log(chalk.grey('\n\t:( There are no tasks currently scheduled.\n'));
        process.exit();
    }
};
