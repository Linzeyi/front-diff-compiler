/**
 * 测试方法一
 * @test 10011
 */
function func1() {
  // do something
  var func1Name = "func1Name";
  func1Name = "changeFunc1Name";
  return func1Name;
}

/**
 * 测试方法二
 * @test 10012,100114
 * @test 100112,100111
 */
let func2 = function() {
  let time = new Date();
  console.log(time);
}

/**
 * 测试方法三
 * @test 10013
 */
const func3 = (type) => {
  return '1' === type;
}

/**
 * 测试方法四（测试用例不存在）
 * @test 10014
 */
new Function ('param','console.log(param)')


/**
 * 测试方法五（类声明）
 * @test 100133
 */
class A {
  constructor(x) {
    this.x = x;
  }
}