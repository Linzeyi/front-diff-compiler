var compiler = require("vue-template-compiler");
const diffCompiler = require("./build");
const nodePath = require("path");
const fomartTestIdArr = function (arr) {
  let tmp = [];
  arr.forEach((item) => {
    tmp = [...tmp, ...item.split(",")];
  });
  return Array.from(new Set(tmp));
};
const collectTestIdJson = [];
exports.handlers = {
  // 利用 vue-template-compiler 编译 vue 模板
  beforeParse: function (e) {
    // console.log(e, 'beforeParse?!@?#!@?#@?')
    if (/\.vue$/.test(e.filename)) {
      var output = compiler.parseComponent(e.source);
      e.source = output.script ? output.script.content : "";
    }
  },
  newDoclet: function (e) {
    const { doclet } = e;
    const { path, filename } = doclet.meta;
    const type = doclet.meta.code.type;
    const funName = doclet.name;
    const undocumented = doclet.undocumented;
    const params = doclet.params;
    const tags = doclet.tags;
    if (!undocumented) {
      const testTags =
        (tags && tags.filter((item) => item.originalTitle === "test")) || [];
      const testIdArr =
        testTags &&
        fomartTestIdArr(
          testTags.map((item) => {
            return item.text.split(" ").join("");
          })
        );
      const testJson = {
        path: nodePath.resolve(path, filename).replace(process.cwd()+ '/', ''),
        type,
        funName,
        testIdArr,
      };
      collectTestIdJson.push(testJson);
      // console.log("type", type);
      // console.log("funName", funName);
      // console.log("testIdArr", testIdArr);
      // console.log("testJson", testJson);
      // console.log("testJson", testJson);
      // console.log("collectTestIdJson", collectTestIdJson);
      // console.log("doclet", doclet);

      // console.log("----------------------------");
    }
  },
  parseComplete: function () {
    // 启动差异分析器
    diffCompiler({
      projectName: "thsc-front-project-pod",
      includes: ["src"],
      collectTestIdJson: collectTestIdJson,
    });
  },
};
