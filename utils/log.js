const {createWriteStream} = require('fs');

const stream = createWriteStream('./.log');

module.exports = str => stream.write(`${str}\n`);
