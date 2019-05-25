const Configstore = require('configstore');

const datastore = new Configstore('tasks');

/**
 * @returns true if the task was deleted and false if it didn't exist
 * @param index of the task
 */
module.exports = (index = 1) => {
	index -= 1;
	const tasks = datastore.get('tasks');

	if (typeof tasks[index] !== 'undefined') {
		tasks.splice(index, 1);
		datastore.set('tasks', tasks);
		return true;
	}

	return false;
};
