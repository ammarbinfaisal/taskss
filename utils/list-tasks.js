const Configstore = require('configstore');
const prepareOutput = require("./prepare-output.js");

const datastore = new Configstore('$_tasks_$');

module.exports = () => {
	const tasks = datastore.get('tasks');
	const grouped = {};
	tasks.forEach(task => {
		const { group } = task;
		if (group) {
			if (!grouped[group])
				grouped[group] = [];
			delete task.group;
			grouped[group].push(task);
		}
	});
	console.log(prepareOutput(grouped))
};