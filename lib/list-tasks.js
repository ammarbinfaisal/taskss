const Configstore = require('configstore');

const datastore = new Configstore('tasks');
const chalk = require('chalk');
const screen = require('../utils/screen');
const edittask = require('./edit-tasks');
const deletetask = require('./delete-task');

let allowedLines;
let linesMapppedToIndex;

const display = tasks => {
	linesMapppedToIndex = {};
	if (tasks && tasks[0]) {
		screen.init();
		screen.clear();
		screen.cursorTo(0, 1);
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
					if (task.done) screen.write(chalk.green.bold('✔'));
					else screen.write(chalk.green.bold('☐'));
					screen.cursorTo(_x);
					screen.nextLine();
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

	const keypressHandler = (chunk, key) => {
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
			arrowTo(index);
		} else if (key && key.name === 'e' && typeof index === 'number') {
			screen.removeListener('keypress', keypressHandler);
			process.stdout.removeListener('resize', resizeHandler);
			edittask(linesMapppedToIndex[`${screen.y}`] + 1);
		}
	};

	screen.addListener('keypress', keypressHandler);
};
