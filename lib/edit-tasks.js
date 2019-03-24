const Configstore = require('configstore');
const chalk = require('chalk');
const readline = require('readline');
const datastore = new Configstore('$_tasks_$');
const log = require('../utils/log');

module.exports = async index => {
    index -= 1;
    const tasks = datastore.get('tasks');
    const task = tasks[index];

    const _task = [[], []];
    if (task) {
        console.clear();
        const allowedPositions = [];
        for (const key in task) {
            if (task.hasOwnProperty(key)) {
                allowedPositions.push([4 + key.length, 4 + key.length + task[key].length]);
                _task[0].push(key);
                _task[1].push(task[key]);
                process.stdout.write(`  ${chalk.cyan(`${key}:`)} ${task[key]}\n`);
            }
        }

        let x = allowedPositions[0][0],
            y = 0;
        const stdin = process.openStdin();
        stdin.setRawMode(true);
        readline.emitKeypressEvents(stdin);

        const positionCursor = () => readline.cursorTo(process.stdout, x, y);
        const setX = () => {
            x =
                x > allowedPositions[y][1]
                    ? allowedPositions[y][1]
                    : x < allowedPositions[y][0]
                        ? allowedPositions[y][0]
                        : x;
        };
        positionCursor();

        const showMessage = msg => {
            let _x = x,
                _y = y;
            x = process.stdout.columns / 2 - 3;
            y = 6;
            positionCursor();
            process.stdout.write(chalk.grey.underline(msg));
            log(JSON.stringify(_task, null, 4));
            x = _x;
            y = _y;
            positionCursor();
        };

        stdin.on('keypress', (chuck, key) => {
            log(JSON.stringify(allowedPositions));
            if (key && key.name === 'up') {
                y = y - 1 < 0 ? 0 : y - 1;
                setX();
                positionCursor();
            } else if (key && key.name === 'down') {
                y = y + 1 > 2 ? 2 : y + 1;
                setX();
                positionCursor();
            } else if (key && key.name === 'left') {
                x = x - 1 < allowedPositions[y][0] ? allowedPositions[y][0] : x - 1;
                positionCursor();
            } else if (key && key.name === 'right') {
                x = x + 1 > allowedPositions[y][1] ? allowedPositions[y][1] : x + 1;
                positionCursor();
            } else if (key && key.ctrl && key.name === 'c') {
                console.clear();
                process.exit();
            } else if (key && key.ctrl && key.name === 's') {
                _task[0].forEach((key, i) => (task[key] = _task[1][i]));
                tasks[index] = task;
                log(JSON.stringify(tasks, null, 4));
                datastore.set('tasks', tasks);
                showMessage('saved');
            } else if (key && key.name && key.name.length === 1) {
                const charCode = key.name.toUpperCase().charCodeAt(0);
                const char = key.name;
                if (charCode >= 65 && charCode <= 90) {
                    _task[1][y] =
                        _task[1][y].substring(0, x - allowedPositions[y][0]) +
                        char +
                        _task[1][y].substring(x - allowedPositions[y][0]);
                    let _x = x;
                    x = allowedPositions[y][0];
                    positionCursor();
                    process.stdout.write(_task[1][y]);
                    x = _x + 1;
                    positionCursor();
                }
            }
        });
    } else {
        console.log(chalk.grey('\n\t:( no task with that index exists.\n'));
    }
};
