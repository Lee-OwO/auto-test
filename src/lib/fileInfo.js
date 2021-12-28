const traverse = require("@babel/traverse").default;
const comment = require("./comment");
const { getFileAst } = require("./utils");

function traverseAst(ast, list, type) {
  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (!path.node?.leadingComments?.length) return;
      const commentInfo = path.node.leadingComments[0].value;
      path.traverse({
        FunctionDeclaration(path) {
          list.push({ key: path.node.id.name, ...comment.parse(commentInfo) });
        },
      });
    },
    FunctionDeclaration(path) {
      if (type !== "commonJS") return;
      if (!path.node?.leadingComments?.length) return;
      const commentInfo = path.node.leadingComments[0].value;
      list.push({ key: path.node.id.name, ...comment.parse(commentInfo) });
    },
  });
}
function getModuleType(ast) {
  let type = "esModule";
  traverse(ast, {
    ExpressionStatement(path) {
      const node = path.node.expression.left;
      if (!node) return;
      if (node.object?.name !== "module") return;
      if (node.property?.name !== "exports") return;
      type = "commonJS";
    },
  });
  return type;
}

module.exports = function (path) {
  const result = [];
  const ast = getFileAst(path);
  const type = getModuleType(ast);
  traverseAst(ast, result, type);

  return {
    info: result,
    type,
  };
};
