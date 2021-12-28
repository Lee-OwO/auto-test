const nodejsPath = require("path");

function getImportCode(fileInfo, path) {
  return `import {${fileInfo.map((v) => v.key).join(",")}} from '${path}'`;
}
function getRequireVode(fileInfo, path) {
  return `const {${fileInfo.map((v) => v.key).join(",")}} = require('${path}')`;
}
function getCode(fileInfo, path, type) {
  if (type === "commonJS") {
    return getRequireVode(fileInfo, path);
  } else if (type === "esModule") {
    return getImportCode(fileInfo, path);
  }
  return "";
}
module.exports = function (api, options) {
  return {
    visitor: {
      Program(path, state) {
        state.isUpdate = false;
        const ast = api.template.ast(
          getCode(options.fileInfo, options.path, options.type)
        );
        path.traverse({
          ImportDeclaration(path) {
            const currPath = path.node.source.value;
            if (nodejsPath.relative(currPath, options.path) === "") {
              path.replaceWith(ast);
              state.isUpdate = true;
              path.stop();
            }
          },
          VariableDeclarator(path) {
            const initNode = path.node.init;
            if (!initNode) return;
            if (initNode?.callee?.name !== "require") return;
            const currPath = initNode?.arguments[0].value;
            if (nodejsPath.relative(currPath, options.path) === "") {
              path.parentPath.replaceWith(ast);
              state.isUpdate = true;
              path.stop();
            }
          },
        });
        if (!state.isUpdate) {
          path.node.body.unshift(ast);
        }
      },
    },
  };
};
