const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw new Error();
    files.forEach((item) => {
      if (item.isDirectory()) {
        return;
      }
      const filePath = path.join(item.path, item.name);
      const fileName = path.parse(filePath).name;
      const extName = path.parse(filePath).ext;

      fs.stat(filePath, (err, data) => {
        if (err) throw new Error();
        stdout.write(
          `${fileName} - ${extName.slice(1, extName.length)} - ${Math.ceil(
            data.size / 1024,
          )}kB\n`,
        );
      });
    });
  },
);
