const Configstore = require('configstore');

const datastore = new Configstore('tasks');
const chalk = require('chalk');
const screen = require('../utils/screen');
const deletetask = require('../lib/delete-task');
const edittask = require('./tasks-editor');

let allowedLines;
let linesMapppedToIndex;

const display = tasks => {
	linesMapppedToIndex = {};
	if (tasks && tasks[0]) {
		screen.clear();
		const grouped = {};
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
					const _x = screen.x;
					const _y = screen.y;
					linesMapppedToIndex[`${_y}`] = task.index;
					screen.cursorTo(process.stdout.columns - 4);
					if (task.done) {
						screen.write(chalk.green.bold('✔'));
					} else {
						screen.write(chalk.green.bold('☐'));
					}

					screen.cursorTo(_x);
					screen.nextLine();
				});

				screen.moveLeft(4);
			}
		}

		allowedLines = Object.keys(linesMapppedToIndex);
	} else {
		screen.clear(true);
		process.exit();
	}
};

module.exports = () => {
	let tasks = datastore.get('tasks');
	if (!tasks || !tasks[0]) {
		screen.write(chalk.grey('\n\t:( There are no tasks currently scheduled.\n\n'));
		process.exit();
	} else {
		display(tasks);
	}

	let index = 0;
	const arrowTo = (newindex = index) => {
		if (typeof newindex === 'number') {
			screen.cursorTo(0, allowedLines[index]);
			screen.write('   '); // Clear arow
			screen.cursorTo(0, allowedLines[newindex]);
			screen.write(chalk.cyan.bold(' =>'));
			index = newindex;
		}

		screen.cursorTo(process.stdout.columns - 1, allowedLines[newindex]);
	};

	arrowTo();

	const resizeHandler = () => {
		display(tasks);
		arrowTo();
	};

	process.stdout.on('resize', resizeHandler);

	function escapeHandler(chunk, key) {
		if (key && key.name === 'escape') {
			screen.clear();
			tasks = datastore.get('tasks');
			display(tasks);
			arrowTo();
			screen.addListener('keypress', keypressHandler);
		}
	}

	function keypressHandler(chunk, key) {
		if (key && key.name === 'up') {
			arrowTo(index - 1 > -1 ? index - 1 : 0);
		} else if (key && key.name === 'down') {
			arrowTo(index + 1 < allowedLines.length ? index + 1 : allowedLines.length - 1);
		} else if (key && key.name === 't') {
			tasks[index].done = !tasks[index].done;
			datastore.set('tasks', tasks);
			screen.cursorTo(process.stdout.columns - 4);
			screen.write(chalk.green.bold(tasks[index].done ? '✔' : '☐'));
			arrowTo(index); // To reset the cursor
		} else if (key && key.name === 'd') {
			const index = linesMapppedToIndex[`${screen.y}`] + 1;
			deletetask(index);
			tasks = datastore.get('tasks');
			display(tasks);
			arrowTo(index - 1);
		} else if (key && key.name === 'e' && typeof index === 'number') {
			screen.removeListener('keypress', keypressHandler);
			screen.addListener('keypress', escapeHandler);
			process.stdout.removeListener('resize', resizeHandler);
			edittask(linesMapppedToIndex[`${screen.y}`] + 1, 'list');
		} else if (key && key.name === 'q') {
			screen.clear();
			process.exit();
		}
	}

	screen.removeListener('keypress', escapeHandler);
	screen.addListener('keypress', keypressHandler);
};
