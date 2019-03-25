const Configstore = require('configstore');
const chalk = require('chalk');
const readline = require('readline');
const log = require('../utils/log');
const edittask = require('./edit-tasks');
const datastore = new Configstore('$_tasks_$');
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
    if (tasks[0]) {
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
        process.stdout.write(prepareOutput(grouped));
        let index = 0;
        const positionArrow = newindex => {
            log(newindex)
            readline.cursorTo(process.stdout, 0, allowedLines[index]);
            process.stdout.write('   '); //clear arow
            readline.cursorTo(process.stdout, 0, allowedLines[newindex]);
            process.stdout.write(chalk.green(' =>'));
            index = newindex;
        };
        positionArrow();
        const stdin = process.openStdin();

        if (stdin.isTTY) stdin.setRawMode(true);
        else {
            console.log(chalk.grey("\n\tit's not tty\n"));
            process.exit();
        }

        readline.emitKeypressEvents(stdin);

        stdin.on('keypress', (chunk, key) => {
            if (key && key.name === 'up') {
                positionArrow(index - 1 > -1 ? index - 1 : 0);
            } else if (key && key.name === 'down') {
                positionArrow(index + 1 < allowedLines.length ? index + 1 : allowedLines.length - 1);
            } else if (key && key.ctrl && key.name === 'c') {
                console.clear();
                process.exit();
            } else if (key && key.name === 'e' && index) {
                stdin.pause();
                edittask(index + 1);
            }
        });
    } else {
        console.log(chalk.grey('\n\t:( There are no tasks currently scheduled.\n'));
    }
};
