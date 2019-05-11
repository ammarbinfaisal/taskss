const Configstore = require('configstore');
const datastore = new Configstore('tasks');
const chalk = require('chalk');
const edittask = require('./edit-tasks');
const deletetask = require('./delete-task');
const screen = require('../utils/screen');

let allowedLines;
let linesMapppedToIndex;

const display = tasks => {
    console.clear();
    linesMapppedToIndex = {};
    if (tasks && tasks[0]) {
        screen.init();
        screen.clear();
        screen.cursorTo(0, 1);
        const grouped = {};
        let index = 1;
        tasks.forEach((task, i) => {
            if (task) {
                const { group } = task;
                if (group) {
                    if (!grouped[group]) {
                        grouped[group] = [];
                    }
                    task.index = i;
                    grouped[group].push(task);
                }
            }
        });
        for (const group in grouped) {
            if (Object.prototype.hasOwnProperty.call(grouped, group)) {
                screen.nextLine();
                screen.moveRight(4);
                screen.write(`${chalk.white.bold(group)}`);
                screen.nextLine();

                grouped[group].forEach(task => {
                    screen.write(`${chalk.grey(task.index + 1 + '.')} ${chalk.rgb(200, 200, 200)(task.task)}`);
                    let _x = screen.getX(),
                        _y = screen.getY();
                    linesMapppedToIndex[`${_y}`] = task.index;
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
        allowedLines = Object.keys(linesMapppedToIndex);
    } else {
        console.log(chalk.grey('\n\t:( There are no tasks currently scheduled.\n'));
        process.exit();
    }
};

module.exports = () => {
    let tasks = datastore.get('tasks');
    display(tasks);

    let index = 0;
    const arrowTo = (newindex = index) => {
        if (typeof newindex === 'number') {
            screen.cursorTo(0, allowedLines[index]);
            screen.write('   '); //clear arow
            screen.cursorTo(0, allowedLines[newindex]);
            screen.write(chalk.cyan.bold(' =>'));
            index = newindex;
        }
        screen.cursorTo(process.stdout.columns - 1, allowedLines[newindex]);
    };
    arrowTo();

    let mode = 'DISPLAY'; // mode so that this event listener in spite of still being present doesn't work - those if conditions fail.
    screen.addListener('keypress', (chunk, key) => {
        if (key && key.name === 'up' && mode === 'DISPLAY') {
            arrowTo(index - 1 > -1 ? index - 1 : 0);
        } else if (key && key.name === 'down' && mode === 'DISPLAY') {
            arrowTo(index + 1 < allowedLines.length ? index + 1 : allowedLines.length - 1);
        } else if (key && key.ctrl && key.name === 'c' && mode === 'DISPLAY') {
            console.clear();
            process.exit();
        } else if (key && key.name === 't' && mode === 'DISPLAY') {
            tasks[index]['done'] = !tasks[index]['done'];
            datastore.set('tasks', tasks);
            screen.cursorTo(process.stdout.columns - 4); // dont know why I have to use ! here but it won't work without it so let it be here
            screen.write(chalk.green.bold(!tasks[index]['done'] ? '☐' : '✔'));
            arrowTo(index); // to reset the cursor
        } else if (key && key.name === 'd' && mode === 'DISPLAY') {
            deletetask(linesMapppedToIndex[`${screen.getY()}`] + 1);
            tasks = datastore.get('tasks');
            display(tasks);
            arrowTo(0);
        } else if (key && key.name === 'e' && typeof index === 'number' && mode === 'DISPLAY') {
            mode = 'EDIT';
            edittask(linesMapppedToIndex[`${screen.getY()}`] + 1);
        }
    });

    process.stdout.on('resize', () => {
        display(tasks);
        arrowTo();
    });
};
