#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const tasks = require('.');

const notifier = updateNotifier({ pkg });
notifier.notify();

const cli = meow(
	`
    Usage
      $ taskss <input>
 
    Options
      --new,    -n  add a new task
      --edit,   -e  edit a task
      --delete, -d  delete a task
	  --task,   -t  add a new task with the given title
	  --group,  -g  group of the task being added by --task

    Examples
      $ taskss
	  $ taskss --new
	  $ taskss -e 1
	  $ taskss -t "improve performance" -g coding
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
		tasks(cli.input[0], cli.flags);
	}, 3000);
} else {
	tasks(cli.input[0], cli.flags);
}
