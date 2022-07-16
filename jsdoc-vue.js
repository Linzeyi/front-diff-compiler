var compiler = require("vue-template-compiler");
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
  // //
  // parseBegin: function (e) {
  //   console.log(e, 'parseBegin?!@?#!@?#@?')
  // },
  // //
  // fileBegin: function (e) {
  //   console.log(e, 'fileBegin?!@?#!@?#@?')
  // },
  // //
  // jsdocCommentFound: function (e) {
  //   console.log(e, 'jsdocCommentFound?!@?#!@?#@?')
  // },
  // //
  // symbolFound: function (e) {
  //   console.log(e, 'jsdocCommentFound?!@?#!@?#@?')
  // },
  //
  newDoclet: function (e) {
    const { doclet } = e;
    const { path } = doclet.meta;
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
        path,
        type,
        funName,
        testIdArr,
      };
      collectTestIdJson.push(testJson);
      // console.log("path:", path);
      // console.log("type", type);
      // console.log("funName", funName);
      // console.log("testIdArr", testIdArr);
      // console.log("testJson", testJson);
      // console.log("testJson", testJson);
      // console.log("collectTestIdJson", collectTestIdJson);
      // // console.log("doclet", doclet);

      // console.log("----------------------------");
    }
  },
  parseComplete: function () {
    console.log("collectTestIdJson", collectTestIdJson);
  },
  // //
  // fileComplete: function (e) {
  //   console.log(e, 'fileComplete?!@?#!@?#@?')
  // },
};

// exports.defineTags = function(dictionary) {
//   dictionary.defineTag('test', {
//     onTagged: function(doclet, tag) {
//         // doclet.scope = "instance";
//         console.log('tag', tag, '!!!!')
//         console.log('doclet', doclet, '!!!!')
//     }
// });
// };
