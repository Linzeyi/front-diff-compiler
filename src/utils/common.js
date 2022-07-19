export const getPlatform = () => {
  let prefix = 'platform::';
  const platform = isAndroid ? 'gphone' : 'iphone'
  return `${prefix}${platform}`;
}

export const getUserid = () => {
  return '123123';
}
const a = () => {
  return '111'
}
/**
 * @test id 2002|24|524 
 * @returns 
 */
export const getUA = function() {
  return 'ua';
}

const obj = {
  name: '对象'
}

/**
 * 
 */
function func1() {
  // do something


  /**
   * 
   */
  const name = 'func1';
}

function func2() {
  // do something
  const name = 'func3';
}

export const uuu = function() {
  return 'ua';
}

testArrowFunc = () => {
  let bbb = '';
  let testArrowChildFunc = () => {
    const name = 'arrow';
  }
}