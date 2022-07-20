const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const vueCompiler = require('vue-template-compiler');
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
const getNodeFromAST = function(ast, type = 'js') {
  const nodes = [];
  if ('js' === type) {
    traverse(ast, {
      ArrowFunctionExpression: function(p) {

        // console.log('------------------------')
        // console.log(p)
      },
      FunctionExpression: function(p) {
        // console.log('------------------------')
        // console.log(p)
      },
      FunctionDeclaration: function(p) {
        nodes.push({
          name: p.node.id.name,
          type: 'FunctionDeclaration',
          code: generate(p.node).code,
        });
      },
      VariableDeclarator: function(p) {
        nodes.push({
          name: p.node.id.name,
          type: 'VariableDeclarator',
          code: generate(p.node).code,
        });
      }
    });
  } else if (type === 'vue') {
    extractVueMethods(ast, nodes);
  }
  return nodes;
};

function extractVueMethods(ast, nodes) {
  let content = ast.script.content;
  content = content.replace(/\s+/g, '');
  content = content.endsWith(';') ? content.slice(0, -1) : content;
  let methods = content.match(/^.*methods:{(.*)}}$/);
  methods = methods?.[1];
  if (methods?.[1]) {
    methods = methods.endsWith(',') ? methods.slice(0, -1) : methods;
    methods.split(',').map(method => {
      const methodName = method.match(/^(.*)\(\).*$/);
      nodes.push({
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
