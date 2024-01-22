const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');

const joinStyles = () => {
  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err.message);
      throw new Error();
    }

    const writeStream = fs.createWriteStream(path.join(distPath, 'bundle.css'));

    const styleFiles = files.filter(
      (file) => file.isFile() && path.parse(file.name).ext === '.css',
    );

    styleFiles.forEach((file) => {
      const readStream = fs.createReadStream(path.join(stylesPath, file.name));

      readStream.pipe(writeStream);
    });
  });
};

joinStyles();
