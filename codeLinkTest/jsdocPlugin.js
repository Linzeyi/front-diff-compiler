var compiler = require("vue-template-compiler");
const diffCompiler = require("../build");
const nodePath = require("path");
const fs = require("fs");
// 最终方法与用例绑定关系数据
const collectTestIdJson = [];

/**
 * 获取子节点数据
 * @param {json} tree
 * @param {string} id
 * @returns Object
 */
const getNodeById = function (tree, id) {
  const data = JSON.parse(tree);
  let arr = Array.isArray(data) ? data : [data];
  let result = null;
  while (arr.length) {
    let item = arr.pop();
    if (item && String(item.id) === String(id)) {
      result = item;
      break;
    } else if (item && item.children && item.children.length) {
      arr.push(...item.children);
    }
  }
  return result;
};

/**
 * 获取对应测试用例id的描述
 * @param {Number} testId
 * @returns
 */
const getTestExampleDesc = function (testId) {
  let testIdDesc = "暂无描述";
  try {
    // 读取测试用例json数据
    const testExampleJson = fs.readFileSync("./mockTest.json", "utf-8");
    const nodeTest = getNodeById(testExampleJson, testId);
    if (nodeTest) {
      testIdDesc = nodeTest.desc;
    }
  } catch (err) {
    console.log("文件读取失败", err);
  }
  return testIdDesc;
};

/**
 * 格式化处理代码中test标记id
 * @param {Array} arr
 * @param {String} funDesc
 * @returns Array<Object>
 */
const fomartTestIdArr = function (arr, funDesc) {
  let tmp = [];
  const hash = {};
  arr.forEach((item) => {
    tmp = [...tmp, ...item.split(",")];
  });
  // 数组格式化 + 去重
  tmp = tmp
    .map((item) => ({
      testId: item,
      testDesc: getTestExampleDesc(item),
      funDesc: funDesc || "暂无说明",
    }))
    .reduce((cur, next) => {
      hash[next.testId] ? "" : (hash[next.testId] = true && cur.push(next));
      return cur;
    }, []);
  return Array.from(new Set(tmp));
};

/**
 * jsdoc插件钩子解析所需注释参数
 */
exports.handlers = {
  beforeParse: function (e) {
    if (/\.vue$/.test(e.filename)) {
      var output = compiler.parseComponent(e.source);
      e.source = output.script ? output.script.content : "";
    }
  },
  newDoclet: function (e) {
    const { doclet } = e;
    const { path, filename, lineno } = doclet.meta;
    const type = doclet.meta.code.type;
    const funName = doclet.name;
    const undocumented = doclet.undocumented;
    const description = doclet.description;
    const tags = doclet.tags;
    if (!undocumented) {
      const testTags =
        (tags && tags.filter((item) => item.originalTitle === "test")) || [];
      // test string 转 Array
      const testTagStringToArr = testTags.map((item) =>
        item.text.split(" ").join("")
      );
      // 获取标准testId数据
      const testIdArr = fomartTestIdArr(testTagStringToArr, description);
      const resolvePath = nodePath
        .resolve(path, filename)
        .replace(process.cwd(), "");
      const testJson = {
        path: nodePath.join("./", resolvePath),
        type,
        funName,
        testIdArr,
        testDescEndLineNo: lineno,
      };
      // 收集每一次注释产生数据
      collectTestIdJson.push(testJson);
    }
  },
  parseComplete: function () {
    console.log("collectTestIdJson", collectTestIdJson);
    // 启动差异分析器
    diffCompiler({
      projectName: "thsc-front-project-pod",
      includes: ["src"],
      collectTestIdJson: collectTestIdJson,
    });
  },
};
