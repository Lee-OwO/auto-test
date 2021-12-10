const _ = require("lodash");
const generate = require("@babel/generator").default;
// =========program=========
function getTestFnPathList(rootPath) {
  const result = [];
  rootPath.traverse({
    ExpressionStatement(path) {
      const name = path.node.expression.callee.name;
      if (name === "test") {
        result.push(path);
        path.skip();
      }
    },
  });
  return result;
}
function getKeyByPath(path) {
  return path?.node?.expression?.arguments[0]?.value || "";
}
function getTestFnCode(key) {
  return `test("${key}", () => {})`;
}
// ===========end============

// ==========arrowFn=========
function isTestBlock(path) {
  return (
    path.parent.type === "CallExpression" && path.parent.callee.name === "test"
  );
}
function judgeRealPath(path, key) {
  const node = path.node?.arguments[0];
  if (!node) return false;
  if (node.type !== "CallExpression") return false;
  if (node.callee.name !== key) return false;
  return true;
}
function getExampleData(fileInfo, key) {
  const data = fileInfo.find((item) => item.key === key);
  return _.cloneDeep(data?.example || []);
}
function getExpectPathListByKey(path, key) {
  const result = [];
  path.traverse({
    CallExpression(path) {
      if (path.node.callee.name !== "expect") return;
      if (!judgeRealPath(path, key)) return;
      result.push(path);
    },
  });
  return result;
}
function getExpectFnCode(data) {
  return `expect(${data.key}(${data.input})).${data.type}(${data.result})`;
}
function getDataByInfo(info) {
  return {
    input: eval(`([${info.input}])`),
    result: eval(`(${info.result})`),
    type: info.type,
  };
}
function getDataByPath(path) {
  const node = path.node.arguments[0];
  const resultNode = path.parentPath.parentPath.node.arguments[0];

  return {
    input: node.arguments.map((item) => eval(`(${generate(item).code})`)),
    result: eval(`(${generate(resultNode).code})`),
    type: path.parentPath.node.property.name,
  };
}
function exampleComparator(path, info) {
  return _.isEqual(getDataByPath(path), getDataByInfo(info));
}

// ===========end============
module.exports = function (api, options) {
  return {
    visitor: {
      Program(path) {
        const testFnList = getTestFnPathList(path);

        _.differenceWith(
          testFnList,
          options.fileInfo,
          (p, { key }) => getKeyByPath(p) === key
        ).forEach((item) => item.remove());

        _.differenceWith(
          options.fileInfo,
          testFnList,
          ({ key }, p) => getKeyByPath(p) === key
        ).forEach((item) => {
          const ast = api.template.ast(getTestFnCode(item.key));
          path.node.body.push(ast);
        });
      },
      ArrowFunctionExpression(path) {
        if (!isTestBlock(path)) return path.skip();

        const key = path.parent.arguments[0].value;
        const exampleData = getExampleData(options.fileInfo, key);
        const expectPathList = getExpectPathListByKey(path, key);

        _.differenceWith(expectPathList, exampleData, (p, i) =>
          exampleComparator(p, i)
        ).forEach((path) =>
          path.find((p) => p.type === "ExpressionStatement").remove()
        );

        _.differenceWith(exampleData, expectPathList, (i, p) =>
          exampleComparator(p, i)
        ).forEach((item) => {
          const ast = api.template.ast(getExpectFnCode({ ...item, key }));
          path.node.body.body.push(ast);
        });
      },
    },
  };
};
