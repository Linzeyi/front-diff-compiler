const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const md5JS = require('md5-js');
const jsondiffpatch = require('jsondiffpatch');
const utils = require('./utils');
const { parserFileAST, traverseAST, getNodeFromAST } = require('./parser');
const { OUTPUT_PATH, KEEP_PATH, FILE_MAP_FILE, DIFF_MAP_FILE} = require('./constant');
// 文件关系日志文件名
const fileMapPath = path.resolve(path.join(OUTPUT_PATH, FILE_MAP_FILE));
// 差异报告
const diffMapPath = path.resolve(path.join(OUTPUT_PATH, DIFF_MAP_FILE));
// 上一次保存的差异报告
const diffMapKeepPath = path.resolve(path.join(OUTPUT_PATH, KEEP_PATH, DIFF_MAP_FILE));

// 配置项
let diffOptions = {
  // 项目名称（容器）
  projectName: "default",
  // 包含扫描目录
  includes: ["src"],
};





/**
 * @description 封装md5加密工具
 * @param {string} str 加密内容
 */
const md5 = function (str) {
  return md5JS(`${diffOptions.projectName}::${str}`);
};


/**
 * 用例绑定关系数据处理
 * @param {Object} collectJson 
 * @returns 
 */
const formatCollectTestJson = function (collectJson){
  const collectTestIdJson = {};
  collectJson.forEach(item =>{
    const {path, funName , testIdArr} = item
    const diffKey = md5(`${path}::${funName}`)
    collectTestIdJson[diffKey] = {
      ...item
    }
  })
  return collectTestIdJson;
}
/**
 * 设置diffmap的值
 * @param {object} diffMap 
 * @param {string} key 
 * @param {object} element 
 * @param {'add'|'remove'|'change'} status 
 * @param {string} oldCode 
 */
const setDiffMap = function(diffMap, key, element, status, oldCode = ''){
  diffMap[key] = {
    eKey:key,
    code: status === 'remove'? '' : element.code,
    oldCode:  oldCode,
    status: status,
    p: element.p,
    e: element.e,
    type: element.type,
    pKey:element.pKey,
    funDesc: element.funDesc,
    testIdArr:element.testIdArr,
  } 
}
/**
 * @description 对比历史记录，生成差异分析报告  
 * @param {Object} elementMap 元素关系映射表
 */
const setDiffReport = async function(elementMap) {
  try {
    let diffMap = {};
    const oldDiffMapStr = await fs.readFileSync(diffMapKeepPath, 'utf-8');
    // 上一次的差异分析报告
    const oldDiffMap = JSON.parse(oldDiffMapStr);
    for(const eKey in elementMap) {
      const element = elementMap[eKey];
      const oldElement = oldDiffMap[eKey];
      if (oldElement) {
        // 该元素存在上一次的扫描结果，进行差异分析，更新
        if(element.code !== oldElement.code){
          setDiffMap(diffMap,eKey, element, 'change', oldElement.code)
        }
        //删除所有存在的，剩下的就是删除的
        delete oldDiffMap[eKey]
      } else {
        // 该元素为新增元素
        setDiffMap(diffMap, eKey, element, 'add')
      }
    }
    //oldDiffMap剩下的都是被删除的
    for(const eKey in oldDiffMap){
      const removeElement = oldDiffMap[eKey]
      setDiffMap(diffMap, eKey, removeElement, 'remove', removeElement.code)
    }
    console.log('> set diff-map over...')
    await fs.writeFileSync(diffMapPath, utils.stringify(diffMap), {});
  } catch(err) {
    // 若获取不到上一次提交的差异分析报告，则直接输出元素分析报告
    fs.writeFileSync(diffMapPath, utils.stringify(elementMap), {});
  }
}

/**
 * @description 提炼关键元素，生成基本的元素映射关系日志
 * @param {Object} fileMap 变更文件映射关系
 */
const setElementMap = async function(fileMap) {
  try {
    const elementMap = {};
    for (const pKey in fileMap) {
      
      const file = fileMap[pKey]
      const diffType = file.diff
      if(diffType !== 'remove'){
        for (const node of file.nodes) {
          const eKey = md5(`${file.p}::${node.name}`);
          const currentTestJson = diffOptions.collectTestIdJson[eKey];
          const testIdArr = currentTestJson ? currentTestJson.testIdArr : [];
          const desc = currentTestJson ? currentTestJson.desc : '暂无描述';
          const element = {
            eKey,
            pKey,
            e: node.name,
            p: file.p,
            code: node.code,
            type: node.type,
            desc,
            testIdArr: testIdArr,
          }
          elementMap[eKey] = element;
        }
      }
    }
    console.log('> set element-map over...')
    setDiffReport(elementMap);
  } catch(e) {
    console.log(err);
  }
}

/**
 * @description 获取文件变更信息
 * @param {string} p 文件路径
 */
const getFileInfo = function (p) {
  return new Promise((resolve) => {
    const pKey = md5(p);
    const type = p.split(".").pop();
    try {
      const code = fs.readFileSync(p, "utf-8");
      // 文件存在，则解析内容，转为AST格式
      const ast = parserFileAST(code, type);
      const nodes = getNodeFromAST(ast, type);
      resolve({
        pKey,
        p,
        type,
        ast,
        code,
        nodes,
        diff: 'change',
      });
    } catch (err) {
      // 文件不存在，则视为删除
      console.log(err);
      resolve({
        pKey,
        p,
        type,
        ast: '',
        code: '',
        nodes: [],
        diff: 'remove',
      });
    }
  });
};

/**
 * @description 设置文件变更关系
 * @param {Array<string>} diffFilePaths 变更的文件路径集合
 */
const setFileMap = async function(diffFilePaths) {
  // 文件变更关系集合
  let fileMap = {};
  for (const p of diffFilePaths) {
    const fileInfo = await getFileInfo(p);
    fileMap[fileInfo.pKey] = fileInfo;
  }
  try {
    fs.accessSync(OUTPUT_PATH);
  } catch (err) {
    console.log("> mkdir ", OUTPUT_PATH);
    // 没有输出目录则新建一个
    fs.mkdirSync(OUTPUT_PATH);
  } finally {
    try {
      lastFileMap = fs.readFileSync(fileMapPath, "utf-8");
    } catch (err) {
      // 不存在上一次变更记录
      lastFileMap = null;
    } finally {
      console.log("> output ", fileMapPath);
      // 更新变更日志
      fs.writeFileSync(fileMapPath, utils.stringify(fileMap), {});
      setElementMap(fileMap);
      console.log('> set file-map over...')
    }
  }
};

/**
 * @description 分析git提交记录，获取差异文件
 */
const getDiffFiles = function () {
  try {
    // 根据扫描范围，获取差异文件路径集合
    const diffFilePaths = execSync("git diff --name-only master")
      .toString()
      .split("\n")
      .filter((v) => !!v && v.includes(diffOptions.includes));
    console.log("> diff files ", diffFilePaths);
    setFileMap(diffFilePaths);
  } catch (err) {
    console.log("error: ", err);
  }
};

module.exports = function (options) {
  if (options) {
    diffOptions.projectName = options.projectName || diffOptions.projectName;
    diffOptions.includes = options.includes || diffOptions.includes;
    diffOptions.collectTestIdJson = formatCollectTestJson(options.collectTestIdJson || []);
  }
  getDiffFiles();
};
