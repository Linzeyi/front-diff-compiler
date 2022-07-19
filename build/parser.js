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
const parserFileAST = function(code, type = 'js') {
  let ast = {}
  if ('vue' === type) {
    const vueRes = vueCompiler.compile(code);
    ast = vueRes.ast;
  } else {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: [
        // enable jsx and flow syntax
        "jsx",
        "flow",
      ],
    });
  }
  return ast;
}

const traverseAST = function(ast) {
  traverse(ast, {
    enter(p, b) {
      console.log(p)
      console.log(b)
      console.log('-------------------------')
    }
  })
}

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
    })
  }
  return nodes;
}

module.exports = {
  parserFileAST,
  traverseAST,
  getNodeFromAST,
};