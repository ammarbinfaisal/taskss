const Configstore = require('configstore');
const chalk = require('chalk');
const log = require('../utils/log');
const edittask = require('./edit-tasks');
const screen = require('../utils/screen');
const datastore = new Configstore('tasks');

const prepareOutput = tasks => {
    let output = '';
    let index = 1;
    for (const group in tasks) {
        if (Object.prototype.hasOwnProperty.call(tasks, group)) {
            // GROUP HEADING
            output += `\n  ${chalk.rgb(255, 255, 255)(group)}\n`;

            tasks[group].forEach(task => {
                output += `      ${chalk.grey(index + '.')} ${chalk.rgb(230, 230, 230)(task.task)}\n`;
                index++;
            });
        }
    }
    return output;
};

module.exports = () => {
    const tasks = datastore.get('tasks');
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
                    delete task.group;
                    grouped[group].push(task);
                    allowedLines.push(y);
                    y++;
                }
            }
        });

        screen.init();
        screen.write(prepareOutput(grouped));

        let index = 0;
        const positionArrow = newindex => {
            if (typeof newindex === 'number') {
                screen.cursorTo(0, allowedLines[index]);
                screen.write('   '); //clear arow
                screen.cursorTo(0, allowedLines[newindex]);
                screen.write(chalk.green(' =>'));
                index = newindex;
            }
            screen.cursorTo(process.stdout.columns - 1, allowedLines[newindex]);
        };
        positionArrow(0);

        let mode = 'DISPLAY';
        screen.addListener('keypress', (chunk, key) => {
            log(index);
            if (key && key.name === 'up' && mode === 'DISPLAY') {
                positionArrow(index - 1 > -1 ? index - 1 : 0);
            } else if (key && key.name === 'down' && mode === 'DISPLAY') {
                positionArrow(index + 1 < allowedLines.length ? index + 1 : allowedLines.length - 1);
            } else if (key && key.ctrl && key.name === 'c' && mode === 'DISPLAY') {
                console.clear();
                process.exit();
            } else if (key && key.name === 'e' && typeof index === 'number' && mode === 'DISPLAY') {
                mode = 'EDIT';
                edittask(index + 1);
            }
        });

        screen.addListener('resize', () => positionArrow(index));
    } else {
        console.log(chalk.grey('\n\t:( There are no tasks currently scheduled.\n'));
    }
};
