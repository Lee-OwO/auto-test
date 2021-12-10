const autoCodeGeneration = require("./autoCodeGeneration");
const jestTest = require("./jestTest");

module.exports = function ({
  sourceDirPath,
  targetDirPath,
  isNeedTest,
  isNeedGenerate,
}) {
  isNeedGenerate &&
    autoCodeGeneration(sourceDirPath, targetDirPath, isNeedTest);
  isNeedTest && jestTest();
};
