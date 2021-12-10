const { spawn } = require("child_process");

module.exports = function (filepath) {
  const paramsList = [];
  if (filepath) {
    paramsList.push(filepath);
  }
  spawn("jest", paramsList, { stdio: "inherit" });
};
