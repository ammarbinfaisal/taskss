#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const taskss = require('.');

const notifier = updateNotifier({ pkg });
notifier.notify();

const cli = meow(
	`
    Usage
		$ taskss <options>
 
    Options
		--new,    -n  add a new task
		--edit,   -e  edit a task
		--delete, -d  delete a task
		--task,   -t  add a new task with the given title
		--group,  -g  group of the task being added by --task

    Examples
		$ taskss          # opens in list mode
		$ taskss -e 1     # opens in edit mode to edit 1st task
		$ taskss --new    # add new task
		$ taskss -t "fix #10" -g coding   # short way to add a task
`,
	{
		flags: {
			new: {
				type: 'boolean',
				alias: 'n'
			},
			edit: {
				type: 'integer',
				alias: 'e'
			},
			delete: {
				type: 'integer',
				alias: 'd'
			},
			task: {
				type: 'string',
				alias: 't'
			},
			group: {
				type: 'string',
				alias: 'g'
			}
		}
	}
);

if (notifier.update) {
	setTimeout(() => {
		taskss(cli.input[0], cli.flags);
	}, 3000);
} else {
	taskss(cli.input[0], cli.flags);
}
