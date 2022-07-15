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
  const funcNodes = [];
  const variableNodes = [];
  if ('js' === type) {
    traverse(ast, {
      enter(p) {
        if (p.node.type.includes(FUNC_TYPE)) {
          funcNodes.push({
            name: p.node.id.name,
            type: 'func',
          });
        }
      }
    })
  }
  return {
    funcNodes,
    variableNodes
  }
}

module.exports = {
  parserFileAST,
  traverseAST,
  getNodeFromAST,
};