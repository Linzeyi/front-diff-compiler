const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const vueCompiler = require('vue-template-compiler');
const { FUNC_TYPE, VARIABLE_TYPE } = require('./constant');
const fs = require('fs');
/**
 * @description 解析语法树
 * @param {string} code 源代码
 * @param {string} type js、vue
 * @return {Object} ast语法树
 */
const parserFileAST = function (code, type = 'js') {
  let ast = {};
  if ('vue' === type) {
    const vueRes = vueCompiler.parseComponent(code);
    ast = vueRes;
  } else {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: [
        // enable jsx and flow syntax
        'jsx',
        'flow'
      ]
    });
  }
  return ast;
};

const traverseAST = function (ast) {
  traverse(ast, {
    enter(p, b) {
      console.log(p);
      console.log(b);
      console.log('-------------------------');
    }
  });
};

/**
 * @description 从AST中提取节点
 * @param {Object} ast AST语法树
 * @param {string} type 文件类型：js｜vue
 */
const getNodeFromAST = function (ast, type = 'js') {
  const funcNodes = [];
  const variableNodes = [];
  if ('js' === type) {
    traverse(ast, {
      enter(p) {
        if (p.node.type.includes(FUNC_TYPE)) {
          funcNodes.push({
            name: p.node.id.name,
            type: 'func'
          });
        }
      }
    });
  } else if (type === 'vue') {
    extractVueMethods(ast, funcNodes, variableNodes);
  }
  return {
    funcNodes,
    variableNodes
  };
};

function extractVueMethods(ast, funcNodes, variableNodes) {
  let content = ast.script.content;
  content = content.replace(/\s+/g, '');
  content = content.endsWith(';') ? content.slice(0, -1) : content;
  let methods = content.match(/^.*methods:{(.*)}}$/);
  methods = methods?.[1];
  if (methods?.[1]) {
    methods = methods.endsWith(',') ? methods.slice(0, -1) : methods;
    methods.split(',').map(method => {
      const methodName = method.match(/^(.*)\(\).*$/);
      funcNodes.push({
        name: methodName?.[1] || '',
        type: 'func'
      });
    });
  }
}

module.exports = {
  parserFileAST,
  traverseAST,
  getNodeFromAST
};
