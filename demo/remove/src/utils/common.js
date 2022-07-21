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
 * 测试方法四（测试用例不存在）
 * @test 10014
 */
new Function ('param','console.log(param)')