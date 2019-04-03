const { createTask, listTasks, editTask, deleteTask } = require('./lib');

module.exports = (input, flags) => {
    if (flags.new) {
        createTask();
    } else if (flags.edit) {
        editTask(flags.edit);
    } else if (flags.delete) {
        deleteTask(flags.delete);
    } else {
        listTasks();
    }
};
