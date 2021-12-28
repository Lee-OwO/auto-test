const getFileInfo = require("./fileInfo");
const path = require("path");
const chokidar = require("chokidar");
const fs = require("fs-extra");

function getInfo(fileInfo) {
  return fileInfo.reduce((result, curr) => result + generInfo(curr), "");
}
function generInfo(info) {
  return `
  ## ${info.key}(${info.paramsInfo.map((v) => v.key).join(",")})
  ### ${info.des}
  ${info.paramsInfo.reduce(
    (result, params) =>
      result +
      `
  #### 参数(${params.key})： type: ${params.type};  des: ${params.des}
  `,
    ""
  )}
  #### 返回值：type: ${info.returnInfo.type};  des:${info.returnInfo.des || "-"}
  `;
}
module.exports = function ({ sourceDirPath, targetPath }) {
  const watchPath = path.resolve(__dirname, sourceDirPath);
  const watcher = chokidar.watch(watchPath, {
    persistent: false,
  });
  let result = "";
  watcher
    .on("add", (path) => {
      const fileInfo = getFileInfo(path);
      result += getInfo(fileInfo.info);
    })
    .on("ready", () => {
      fs.writeFileSync(targetPath, result);
    });
};
