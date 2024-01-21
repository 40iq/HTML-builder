const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Type your text to moodify text.txt file:\n');

process.on('exit', () => stdout.write('Process completed!'));

stdin.on('data', (data) => {
  const readableData = data.slice(0, data.length - 2).toString();
  if (readableData === 'exit') {
    exit();
  }
  output.write(data.slice(0, data.length - 2).toString());
});

process.on('SIGINT', () => exit());
