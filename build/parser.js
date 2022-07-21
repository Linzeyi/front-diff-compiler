const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const {parse, compileScript} =  require('@vue/compiler-sfc')
/**
 * @description 解析语法树
 * @param {string} code 源代码
 * @param {string} type js、vue
 * @return {Object} ast语法树
 */
const parserFileAST = function (code, type = 'js') {
  let ast = {};
  if(type==='vue' || type==='js'){
    if (type === 'vue') {
      code = compileScript(parse(code).descriptor,{id:'xxxxx'}).content
    }
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: [
        // enable jsx and flow syntax
        'jsx',
        'typescript'
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
    parseVue(ast, nodes);
  }
  return nodes;
};

/**
 * 解析vue文件中的变量和方法
 * @param {*} ast 
 * @param {*} nodes 
 */
function parseVue(ast, nodes) {
  traverse(ast,{
    ObjectMethod(p){
      if(p.node.key.name==='data'){
        p.traverse({
          ObjectProperty(path){
            nodes.push({
              name: path.node.key.name,
              type: 'VariableDeclarator',
              code: generate(path.node).code,
            });
          }
        })
      }
    },
    ObjectProperty(p){
      if(p.node.key.name==='methods'){
        p.traverse({
          ObjectMethod(path){
            nodes.push({
              name: path.node.key.name,
              type: 'FunctionDeclaration',
              code: generate(path.node).code,
            });
          },
          ObjectProperty(path){
            nodes.push({
              name: path.node.key.name,
              type: 'FunctionDeclaration',
              code: generate(path.node).code,
            });
          }
        })
      }else if(p.node.key.name === 'computed'){
        p.traverse({
          ObjectMethod(path){
            nodes.push({
              name: path.node.key.name,
              type: 'VariableDeclarator',
              code: generate(path.node).code,
            });
          },
          ObjectProperty(path){
            nodes.push({
              name: path.node.key.name,
              type: 'VariableDeclarator',
              code: generate(path.node).code,
            });
          }
        })
      }
    },
    ClassProperty(p){
      nodes.push({
        name: p.node.key.name,
        type: 'VariableDeclarator',
        code: generate(p.node).code,
      });
    },
    ClassMethod(p){
      nodes.push({
        name: p.node.key.name,
        type: 'FunctionDeclaration',
        code: generate(p.node).code,
      });
    }
  })
}

module.exports = {
  parserFileAST,
  traverseAST,
  getNodeFromAST
};
