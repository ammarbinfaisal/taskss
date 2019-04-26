const readline = require('readline');
const chalk = require('chalk');
const stdin = process.openStdin();
const log = require('./log');

let _x = 0,
    _y = 0;

// default params so that function can be called without params
// assigining _x and _y the value passed so that position of cursor can be known by the program
const cursorTo = (x = _x, y = _y) => {
    x = Math.round(x);
    y = Math.round(y);
    _x = x;
    _y = y;
    readline.cursorTo(process.stdout, x, y);
};

const nextLine = () => readline.cursorTo(process.stdout, _x, ++_y);

const moveRight = (rightSpaces = 1) => {
    if (rightSpaces === 0) cursorTo();
    else {
        _x++;
        moveRight(--rightSpaces);
    }
};

const moveLeft = (leftSpaces = 1) => {
    if (leftSpaces === 0) cursorTo();
    else {
        _x--;
        moveLeft(--leftSpaces);
    }
};

const addListener = (eventname, cb) => stdin.addListener(eventname, cb);

const removeListener = (eventname, cb) => stdin.removeListener(eventname, cb);

const write = str => process.stdout.write(str);

const getX = () => _x;

const getY = () => _y;

const showTitle = () => {
    cursorTo((process.stdout.columns - 5) / 2, 0);
    write(chalk.bold('TASKS'));
    nextLine();
    cursorTo(0);
};

const clear = () => {
    console.clear();
    showTitle();
};

if (typeof process.screen === 'undefined') {
    process.screen = {};
    process.screen.INITIALIZED = false;
}
const init = () => {
    if (process.screen && !process.screen.INITIALIZED) {
        process.screen.INITIALIZED = true;
        if (stdin.isTTY) stdin.setRawMode(true);
        else {
            console.log(chalk.grey("\n\tit's not tty\n"));
            process.exit();
        }

        readline.emitKeypressEvents(stdin);

        stdin.on('keypress', (chunk, key) => {
            if (key && key.ctrl && key.name === 'c') {
                console.clear();
                process.exit();
            }
        });
    }
};

module.exports = {
    init,
    clear,
    cursorTo,
    nextLine,
    moveRight,
    moveLeft,
    write,
    addListener,
    removeListener,
    getX,
    getY
};
