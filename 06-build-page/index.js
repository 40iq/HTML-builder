const fs = require('fs');
const path = require('path');

const componentsFolderPath = path.join(__dirname, 'components');
const distFolderPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');

const createDistFolder = (callback) => {
  fs.mkdir(distFolderPath, (err) => {
    if (err) {
      clearDirectory(distFolderPath);
      callback();
      copyAssets();
      mergeStyles();
    } else {
      callback();
      copyAssets();
      mergeStyles();
    }
  });
};

const clearDirectory = (curPath) => {
  fs.readdir(curPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log('ErroR');

    let filesToDelete = files.length;

    files.forEach((file) => {
      if (file.isFile()) {
        fs.unlink(path.join(curPath, file.name), () => {});
        filesToDelete -= 1;
      }
      if (file.isDirectory()) {
        clearDirectory(path.join(curPath, file.name));
        filesToDelete -= 1;
      }
      if (filesToDelete === 0) {
        fs.rmdir(path.join(curPath, file.name), () => {});
      }
    });
  });
};

const replaceTemplate = () => {
  let htmlContent = '';

  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
    if (err) console.log('File didn"t read');
    htmlContent = data;

    fs.readdir(componentsFolderPath, { withFileTypes: true }, (err, files) => {
      if (err) console.log('Dir didn"t read');

      let componentToReplace = files.length;

      files.forEach((file) => {
        const component = path.parse(file.name).name;

        fs.readFile(
          path.join(componentsFolderPath, file.name),
          'utf-8',
          (error, data) => {
            if (error) console.log(error.message);

            const componentContent = data;
            htmlContent = htmlContent.replaceAll(
              `{{${component}}}`,
              componentContent,
            );
            componentToReplace -= 1;
            if (componentToReplace === 0) {
              fs.writeFile(
                path.join(distFolderPath, 'index.html'),
                htmlContent,
                (err) => {
                  if (err) console.log('Error with writing file');
                },
              );
            }
          },
        );
      });
    });
  });
};

const mergeStyles = () => {
  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log('Error with style merge');
      throw new Error();
    }

    const writeStream = fs.createWriteStream(
      path.join(distFolderPath, 'style.css'),
    );

    const styleFiles = files.filter(
      (file) => file.isFile() && path.parse(file.name).ext === '.css',
    );

    styleFiles.forEach((file) => {
      const readStream = fs.createReadStream(path.join(stylesPath, file.name));

      readStream.pipe(writeStream);
    });
  });
};

const filesFolderPath = path.join(__dirname, 'assets');
const copyFolderPath = path.join(distFolderPath, 'assets');

const createCopy = (callback) => {
  fs.mkdir(copyFolderPath, (err) => {
    if (err) {
      console.log('Folder already exist');
      clearDirectory(copyFolderPath);
      callback();
    } else {
      console.log('Folder created');
      callback();
    }
  });
};

const copyFiles = (from = filesFolderPath, to = copyFolderPath) => {
  fs.readdir(from, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log('Error while reading files');
      return;
    }

    files.forEach((file) => {
      if (file.isFile()) {
        fs.copyFile(
          path.join(from, file.name),
          path.join(to, file.name),
          () => {},
        );
      } else {
        fs.mkdir(path.join(to, file.name), () => {});
        copyFiles(path.join(from, file.name), path.join(to, file.name));
      }
    });
  });
};

const copyAssets = () => {
  createCopy(copyFiles);
};

createDistFolder(replaceTemplate);
