'use strict';
const meow = require('meow');
const tasks = require('.');

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
			}
		}
	}
);

tasks(cli.input[0], cli.flags);
