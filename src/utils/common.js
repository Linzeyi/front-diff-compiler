/**
 * asdasd
 * @test 1001
 */
const fxh =  123; 


export const getPlatform = () => {
  const platform = isAndroid ? "gphone" : "iphone";
  return platform;
};

/**
 * Book类，代表一个书本.
 * @param {string} title - 书本的标题.
 * @param {string} author - 书本的作者.
 * @test 100111
 */
const Book = function (title, author) {
  this.title = title;
  this.author = author;
};

/**
 * 获取userid
 * @param {string} platform - 平台.
 * @param {string} author - 版本.
 * @test 100112
 */
const getUserid = (platform, version) => {
  return platform + version;
};

/**
 * 获取UA
 * @returns {Number} ua信息
 * @test 100113
 */
export const getUA = function () {
  return "ua";
};

/**
 * 测试方法一
 * @test 10011
 */
function func1() {
  // do something
  const name = "func1";
}

/**
 * 测试方法二
 * @test 10012,100114
 * @test 100112,100111
 */
function func2() {
  // do something
  const name = "func3";
}

/**
 * 测试方法三
 * @test 10013
 */
function func3() {
  // do something
  const name = "func3";
}
