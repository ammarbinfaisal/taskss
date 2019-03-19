const chalk = require("chalk");

module.exports = tasks => {
	let output = "";
	for (const group in tasks) {
		if (tasks.hasOwnProperty(group)) {
			// GROUP HEADING
			output += `\n\n  ${(chalk.rgb(255, 255, 255))(group)}\n`;

			tasks[group].forEach((task, i) => {
				output += `      ${chalk.grey(i + 1 + ".")} ${(chalk.rgb(244, 244, 244))(task.task)}\n`;
			})
		}
	}
	return output;
}