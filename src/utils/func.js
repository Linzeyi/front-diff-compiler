function a(x) {
  const testVarianle1 ='1', testVarianle2 = '2';
  const testVarianle3 ='3';
}

// 注意：第二条和第三条在AST中意义不同
let b = function(x=1) {}

b = function(...x) {}

let c = ([x]=[1]) => {}

async function d(x) {}

function *e(x) {}

class A {
  constructor(x) {}
}

new Function ('x','console.log(x)')

(function(){return function(x){}})()

eval("(function(){return function(a,b){}})()")