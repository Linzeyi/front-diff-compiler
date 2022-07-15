module.exports = {
  stringify: function(obj) {
    let cache = [];
    let str = JSON.stringify(obj, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // 移除
          return;
        }
        // 收集所有的值
        cache.push(value);
      }
      return value;
    }, 2);
    cache = null; // 清空变量，便于垃圾回收机制回收
    return str;
  }
}