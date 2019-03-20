'use strict';
const meow = require('meow');
const tasks = require('.');
// Const updateNotifier = require('update-notifier');
// const pkg = require('./package.json');

// updateNotifier({pkg}).notify();

const cli = meow(
	`
    Usage
      $ tasks <input>
 
    Options
      --new,  -n  add a new task

    Examples
      $ tasks --new
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
			}
		}
	}
);

tasks(cli.input[0], cli.flags);
