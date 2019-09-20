const Configstore = require('configstore');

const datastore = new Configstore('tasks');

module.exports = async (name, group) => {
	const task = { task: name, group: group || 'general' };

	let tasks = datastore.get('tasks');
	if (!tasks) {
		tasks = [];
	}

	tasks.push(task);
	task.done = false;
	datastore.set('tasks', tasks);
};
