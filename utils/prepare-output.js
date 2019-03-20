const chalk = require('chalk');

module.exports = tasks => {
	let output = '', index = 1;
	for (const group in tasks) {
		if (Object.prototype.hasOwnProperty.call(tasks, group)) {
			// GROUP HEADING
			output += `\n\n  ${chalk.rgb(255, 255, 255)(group)}\n`;

			tasks[group].forEach((task) => {
				output += `      ${chalk.grey(index + '.')} ${chalk.rgb(244, 244, 244)(task.task)}\n`;
				index++;
			});
		}
	}
	return output;
};
