# front-diff-compiler

前端

## 演示

1. 将该项目上传至master分支；
2. fork新的开发分支，例如feature，checkout至该分支；
3. 在src目录里修改文件，提交commit，制造代码变更的场景（./demo/目录下放了一些模板案例，将里面的src替换当前src目录，即可快速营造add、change、remove三种变更场景）
4. 执行npm run doc，差异分析报告会输出至./diff_output/diff-map.json文件里；
5. 如何模拟上一次已提交的差异报告：将./diff_output/element-map.json拷贝一份至./diff_output/.keep/文件夹内，合到master，然后切回开发分支，修改src制造变更，重新执行npm run doc。

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

### 2. 绑定测试用例-代码函数对应关系方案
### 启动

`npm run doc`

### 方案
1. 通过jsdoc-vuejs + jsdoc完成对代码函数解析

2. 在jsdoc-vuejs中通过jsdoc-plugin暴露的方法newDoclet来获取对应目录下的函数-注释对应关系。解析@test 字符串/数据，生成json数据。

3. 通过jsdoc-plugin暴露的方法parseComplete当数据解析完成时，启动差异分析器 diffCompile，将获取的数据传入并解析，在变更文件映射关系-setElement中完成数据组装