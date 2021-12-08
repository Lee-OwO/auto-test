const fs = require("fs-extra");
const path = require("path");
const { transformFromAstSync } = require("@babel/core");
const generatePlugin = require("./plugins/code-generate-plugin");
const autoImportPlugin = require("./plugins/auto-import-plugin");
const { getFileAst } = require("./utils");
const getFileInfo = require("./fileInfo");

module.exports = function ({ sourcePath, targetPath }) {
  const fileInfo = getFileInfo(sourcePath);
  const ast = getFileAst(targetPath);
  const { code } = transformFromAstSync(ast, "", {
    filename: path.basename(sourcePath),
    configFile: false,
    plugins: [
      [
        autoImportPlugin,
        {
          fileInfo,
          path: path.relative(path.resolve(targetPath, "../"), sourcePath),
        },
      ],
      [
        generatePlugin,
        {
          fileInfo,
        },
      ],
    ],
  });
  fs.writeFileSync(targetPath, code);
};
