const fs = require('fs');
const path = require('path');

const filesFolderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

const createCopy = (callback) => {
  fs.mkdir(copyFolderPath, (err) => {
    if (err) {
      console.log('Folder already exist');
      fs.readdir(copyFolderPath, (err, files) => {
        let filesToDelete = files.length;
        if (err) throw new Error();
        files.forEach((file) => {
          filesToDelete -= 1;
          fs.unlink(path.join(copyFolderPath, file), (error) => {
            if (error) throw new Error();
          });
          if (filesToDelete === 0) {
            callback();
          }
        });
      });
      return;
    }
    console.log('Folder created');
    callback();
  });
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
