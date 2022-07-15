# front-diff-compiler

前端代码差异分析与用例绑定工具

## 启动

`npm run diff`

## 方案

1. git diff 获取差异文件，fs扫描文件获取源代码；
2. 利用babel-paser、vue-template-compiler等工具将源码解析为AST格式，输出**AST日志**；
3. 对AST日志内容做分析，提炼出元素信息（元素指代各个分析的节点，例如：函数、变量等）【注意：每个元素都应该用文件名+元素名生成一个唯一索引，保证每次变更都能追溯到该元素】，生成**关系日志**；
4. 将关系日志里的元素与模拟的用例列表作关联绑定（ ~~可视化界面？~~ 注释自动绑定？），将新增的关系依赖存入**关系日志**；
	1. 若存在相同索引，代表该元素已有关联信息，则判断新关联用例是否已被关联，有则更新状态为“变更”；无则新增该用例的关联关系，并设置状态为“新增”；
	2. 若无匹配的索引，代表该元素从未被关联，即新增，则将该元素存入并设置其关联的用例状态为“新增”；
	3. 问题：怎么定义删除的元素？
5. 分析**关系日志**，提取用例状态，结合绑定元素生成**测试报告**（报告包含：变更元素内容，关联用例，用例状态等）