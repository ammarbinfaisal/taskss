const readline = require('readline');
const chalk = require('chalk');

const stdin = process.openStdin();

let _x = 0;
let _y = 0;

// Default params so that function can be called without params
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
	if (rightSpaces === 0) {
		cursorTo();
	} else {
		_x++;
		moveRight(--rightSpaces);
	}
};

const moveLeft = (leftSpaces = 1) => {
	if (leftSpaces === 0) {
		cursorTo();
	} else {
		_x--;
		moveLeft(--leftSpaces);
	}
};

const addListener = (eventname, cb) => stdin.addListener(eventname, cb);

const removeListener = (eventname, cb) => stdin.removeListener(eventname, cb);

const write = str => process.stdout.write(str);

const showTitle = () => {
	cursorTo((process.stdout.columns - 5) / 2, 0);
	write(chalk.bold('TASKSS'));
	cursorTo(0);
};

const clear = dontShowTitle => {
	console.clear();
	if (dontShowTitle) {
		return;
	}

	showTitle();
};

const init = () => {
	if (stdin.isTTY) {
		stdin.setRawMode(true);
	} else {
		console.log(chalk.grey("\n\tNot running in a terminal\n"));
		process.exit();
	}

	readline.emitKeypressEvents(stdin);
	stdin.on('keypress', (chunk, key) => {
		if (key && key.ctrl && key.name === 'c') {
			clear(false);
			process.exit();
		}
	});
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
	removeListener
};

Object.defineProperty(module.exports, 'x', {
	get() {
		return _x;
	}
});

Object.defineProperty(module.exports, 'y', {
	get() {
		return _y;
	}
});
