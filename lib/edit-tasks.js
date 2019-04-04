const Configstore = require('configstore');
const chalk = require('chalk');
const screen = require('../utils/screen');
const datastore = new Configstore('tasks');
const log = require('../utils/log');

module.exports = index => {
    index -= 1; // becuse user would start giving it from 1 and we count from 0 :D
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
                screen.write(`  ${chalk.cyan(`${key}:`)} ${task[key]}\n`);
            }
        }

        let x = allowedPositions[0][0],
            y = 0;

        const positionCursor = () => screen.cursorTo(x, y);
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
            x = 0;
            y = 6;
            positionCursor();
            for (let i = 0; i < process.stdout.columns; i++) screen.write(' '); // to clear the line
            x = Math.floor(process.stdout.columns / 2 - msg.length / 2);
            y = 6;
            positionCursor();
            screen.write(chalk.grey.underline(msg));
            log(JSON.stringify(_task, null, 4));
            x = _x;
            y = _y;
            positionCursor();
        };

        stdin.on('keypress', (chunk, key) => {
            log(JSON.stringify({ chunk, key }));
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
                let canBeSaved = true;
                _task[0].forEach((key, i) => {
                    if (_task[1][i]) task[key] = _task[1][i];
                    else {
                        showMessage(`${_task[0][i]} can't be empty`);
                        canBeSaved = false;
                    }
                });
                if (canBeSaved) {
                    tasks[index] = task;
                    datastore.set('tasks', tasks);
                    showMessage('saved');
                }
            } else if (key && key.name === 'backspace') {
                _task[1][y] =
                    _task[1][y].substring(0, x - allowedPositions[y][0] - 1) +
                    _task[1][y].substring(x - allowedPositions[y][0]);
                let _x = x;
                x = allowedPositions[y][0];
                positionCursor();
                screen.write(_task[1][y] + ' ');
                x = _x - 1 < allowedPositions[y][0] ? allowedPositions[y][0] : _x - 1;
                positionCursor();
            } else if (key && key.name === 'delete') {
                _task[1][y] =
                    _task[1][y].substring(0, x - allowedPositions[y][0]) +
                    _task[1][y].substring(x - allowedPositions[y][0] + 1);
                let _x = x;
                x = allowedPositions[y][0];
                positionCursor();
                screen.write(_task[1][y] + ' ');
                x = _x;
                positionCursor();
            } else if (chunk && chunk.length === 1 && !key.ctrl) {
                _task[1][y] =
                    _task[1][y].substring(0, x - allowedPositions[y][0]) +
                    chunk +
                    _task[1][y].substring(x - allowedPositions[y][0]);
                let _x = x;
                x = allowedPositions[y][0];
                positionCursor();
                screen.write(_task[1][y]);
                x = _x + 1;
                positionCursor();
            }
        });
    } else {
        console.log(chalk.grey('\n\t:( no task with that index exists.\n'));
    }
};
