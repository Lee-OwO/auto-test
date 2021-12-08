const traverse = require("@babel/traverse").default;
const comment = require("./comment");
const { getFileAst } = require("./utils");

function traverseAst(ast, list) {
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const commentInfo = path.node.leadingComments[0].value;
      path.traverse({
        FunctionDeclaration(path) {
          list.push({ key: path.node.id.name, ...comment.parse(commentInfo) });
        },
      });
    },
  });
}

module.exports = function (path) {
  const result = [];
  const ast = getFileAst(path);
  traverseAst(ast, result);

  return result;
};
