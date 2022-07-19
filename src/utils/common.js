/**
 * asdasd
 * @test 111
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
 * @test 010001
 */
const Book = function (title, author) {
  this.title = title;
  this.author = author;
};

/**
 * 获取userid
 * @param {string} platform - 平台.
 * @param {string} author - 版本.
 * @test 010001
 */
const getUserid = (platform, version) => {
  return platform + version;
};

/**
 * 获取user name
 * @param {string} age - 年龄.
 * @param {string} sex - 性别.
 * @test 010003
 */
const getName = (age, sex) => {
  return '小明'
};

/**
 * 获取UA
 * @returns {Number} ua信息
 * @test 010001
 */
export const getUA = function () {
  return "ua";
};

/**
 * 测试方法一
 * @test 010001
 */
function func1() {
  // do something
  const name = "func1";
}

/**
 * 测试方法二
 * @test 010001,01003
 * @test 330001,01003
 */
function func2() {
  // do something
  const name = "func3";
}

/**
 * 测试方法三
 * @test 010001
 */
function func3() {
  // do something
  const name = "func3";
}
