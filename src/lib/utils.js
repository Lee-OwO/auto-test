const parser = require("@babel/parser");
const fs = require("fs-extra");

function getFileAst(path) {
  const sourceCode = fs.readFileSync(path, "utf8");
  const ast = parser.parse(sourceCode, {
    sourceType: "unambiguous",
  });
  return ast;
}

module.exports = {
  getFileAst,
};
