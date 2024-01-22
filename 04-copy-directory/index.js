const fs = require('fs');
const path = require('path');

const filesFolderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

const createCopy = (callback) => {
  fs.mkdir(copyFolderPath, (err) => {
    if (err) {
      console.log('Folder already exist');
      return;
    }
    console.log('Folder created');
  });

  callback();
};

const copyFiles = () => {
  fs.readdir(filesFolderPath, (err, files) => {
    if (err) {
      console.log('Error while reading files');
      return;
    }
    let finishedOperations = 0;

    files.forEach((file) => {
      fs.copyFile(
        path.join(filesFolderPath, file),
        path.join(copyFolderPath, file),
        () => {
          finishedOperations += 1;

          console.log(`${file} is copied`);

          if (finishedOperations === files.length) {
            console.log('Copy is done');
          }
        },
      );
    });
  });
};

const copyDir = () => {
  createCopy(copyFiles);
};

copyDir();
