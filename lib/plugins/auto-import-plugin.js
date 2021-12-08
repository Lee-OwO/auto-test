const nodejsPath = require("path");

function getImportCode(fileInfo, path) {
  return `import {${fileInfo.map((v) => v.key).join(",")}} from '${path}'`;
}
module.exports = function (api, options) {
  return {
    visitor: {
      Program(path, state) {
        state.isUpdate = false;
        const ast = api.template.ast(
          getImportCode(options.fileInfo, options.path)
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
        });
        if (!state.isUpdate) {
          path.node.body.unshift(ast);
        }
      },
    },
  };
};
