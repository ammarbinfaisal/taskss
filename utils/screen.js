const readline = require('readline');
const chalk = require('chalk');
const stdin = process.openStdin();

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

const cursorTo = (x = 0, y = 0) => readline.cursorTo(process.stdout, x, y);

const addListener = (eventname, cb) => stdin.addListener(eventname, cb);

const removeListener = (eventname, cb) => stdin.removeListener(eventname, cb);

const write = str => process.stdout.write(str);

module.exports = { init, cursorTo, write, addListener, removeListener };
