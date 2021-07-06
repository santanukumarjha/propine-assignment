const fs = require('fs');
const path = require('path');

module.exports = () => {
  var file = 'help.txt';
  const help = fs.readFileSync(path.join(__dirname, file), 'utf8');
  return console.log(help);
};
