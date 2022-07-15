const diffCompiler = require('./build');
// 启动差异分析器
diffCompiler({
  projectName: 'thsc-front-project-pod',
  includes: ['src'],
});