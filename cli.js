#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const tasks = require('.');

updateNotifier({ pkg }).notify();

const cli = meow(
	`
    Usage
      $ taskss <input>
 
    Options
      --new,    -n  add a new task
      --edit,   -e  edit a task
      --delete, -d  delete a task

    Examples
      $ taskss
      $ taskss --new
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

tasks(cli.input[0], cli.flags);
