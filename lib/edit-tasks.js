const Configstore = require('configstore');
const chalk = require('chalk');

const datastore = new Configstore('tasks');
const screen = require('../utils/screen');

module.exports = index => {
    index -= 1; // Becuse user would start from 1 but we count from 0 :D
    const tasks = datastore.get('tasks');
    const task = tasks[index];

    /*
        First array to containn keys of task object and 
        the second one to contain values
    */
    const _task = [[], []];
    if (task) {
        screen.clear();
        /* 
            Outer array for y index and the inner for 
            starting and ending x index
         */
        const maxXValues = [null, null];
        screen.cursorTo(0, 2);

        const maxKeyLen = Math.max.apply(null, Object.keys(task).map(key => key.length));
        const minXValue = maxKeyLen + 4;
        Object.entries(task).forEach(([key, value]) => {
            if (key !== 'done' && key !== 'index') {
                maxXValues.push(minXValue + value.length);
                _task[0].push(key);
                _task[1].push(value);
                key += ':';
                while (key.length <= maxKeyLen) key += ' ';
                screen.write(`  ${chalk.cyan(`${key}`)} ${value}\n`);
            }
        });

        const positionCursor = (x, y) => {
            y = y || screen.getY();
            y = y < 2 ? 2 : y > 3 ? 3 : y;

            x = x || screen.getX(); // If not passed
            // prettier-ignore
            x = x                   // If x is not passed and screen.getX() gives 0
                ? x > maxXValues[y]    // And if is greater than max allowed value at that line
                    ? maxXValues[y]    // Then set it as max allowed value
                    : x < minXValue    // And if is less than min x value
                    ? minXValue            // Then set it as min x value
                    : x                // Otherwise let it be x
                : minXValue // If not passed then make it min x value

            screen.cursorTo(x, y);
        };

        positionCursor();

        const showMessage = msg => {
            const _x = screen.getX();
            const _y = screen.getY();
            positionCursor(0, 6);
            // To clear the line
            for (let i = 0; i < process.stdout.columns; i++) screen.write(' ');
            positionCursor(Math.floor(process.stdout.columns / 2 - msg.length / 2), 6);
            screen.write(chalk.grey.underline(msg));
            positionCursor(_x, _y);
        };

        screen.init();
        screen.addListener('keypress', (chunk, key) => {
            const _x = screen.getX();
            const _y = screen.getY();
            const i = _y - 2;
            if (key && key.name === 'up') {
                positionCursor(undefined, _y - 1);
            } else if (key && key.name === 'down') {
                positionCursor(undefined, _y + 1);
            } else if (key && key.name === 'left') {
                positionCursor(_x - 1);
            } else if (key && key.name === 'right') {
                positionCursor(_x + 1);
            } else if (key && key.ctrl && key.name === 's') {
                let canBeSaved = true;
                _task[0].forEach((key, i) => {
                    if (_task[1][i].toString().trim()) task[key] = _task[1][i];
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
                _task[1][i] = _task[1][i].substring(0, _x - minXValue - 1) + _task[1][i].substring(_x - minXValue);
                positionCursor(minXValue);
                screen.write(_task[1][i] + ' ');
                positionCursor(_x - 1);
            } else if (key && key.name === 'delete') {
                _task[1][i] = _task[1][i].substring(0, _x - minXValue) + _task[1][i].substring(_x - minXValue + 1);
                positionCursor(minXValue);
                screen.write(_task[1][i] + ' ');
                positionCursor(_x - 1);
            } else if (chunk && chunk.length === 1 && !key.ctrl) {
                _task[1][i] = _task[1][i].substring(0, _x - minXValue) + chunk + _task[1][i].substring(_x - minXValue);
                positionCursor(minXValue);
                screen.write(_task[1][i]);
                positionCursor(_x + 1);
            }
        });
    } else {
        console.log(chalk.grey('\n\t:( no task with that index exists.\n'));
    }
};
