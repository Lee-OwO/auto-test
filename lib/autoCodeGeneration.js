const path = require("path");
const fs = require("fs-extra");
const fileWatcher = require("./watcher");
const codeGenerater = require("./codeGenerater");
const jestTest = require("./jestTest");

function getTargetFilePath(filepath, targetDirPath) {
  const fileName = path.basename(filepath, ".js");
  return path.resolve(targetDirPath, `./${fileName}.spec.js`);
}

module.exports = function (sourceDirPath, targetDirPath, isNeedTest = true) {
  fs.ensureDirSync(path.resolve(targetDirPath));
  fileWatcher({
    sourceDirPath: path.resolve(sourceDirPath),
    add(filepath) {
      const targetFilePath = getTargetFilePath(filepath, targetDirPath);
      fs.ensureFileSync(targetFilePath);
      codeGenerater({ sourcePath: filepath, targetPath: targetFilePath });
    },
    change(filepath) {
      const targetFilePath = getTargetFilePath(filepath, targetDirPath);
      codeGenerater({ sourcePath: filepath, targetPath: targetFilePath });
      isNeedTest && jestTest(targetFilePath);
    },
    remove(filepath) {
      const targetFilePath = getTargetFilePath(filepath, targetDirPath);
      fs.removeSync(targetFilePath);
    },
  });
};
