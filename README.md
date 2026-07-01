# 智绘适老网页 Demo

这是“智绘适老”技术组网页前端原型，核心入口包括：

- 扫描评估：确认老人情况和空间，按关键视角完成采集，生成风险报告。
- 方案商城：根据风险项推荐适老产品和服务方案。
- 效果社区：展示复扫案例、改造提问和服务评价。

## 本地运行

建议使用 Node.js 20.19 或更高版本。项目已包含 `package-lock.json`，组员拉取后按下面步骤运行：

```bash
npm install
npm run dev
```

启动后打开终端输出的本地地址，通常是：

```text
http://localhost:5173/
```

## 常用命令

```bash
npm test
npm run build
npm run preview
```

## 目录说明

```text
src/App.jsx          页面结构和交互
src/demoData.js     商品、风险、社区等演示数据
src/logic.js        风险报告、方案匹配等逻辑
src/styles.css      页面样式
public/assets/      本地图片素材
```

## 协作注意

- 不提交 `node_modules/` 和 `dist/`。
- 修改图片素材后，需要同步检查 `src/demoData.js` 中的图片路径。
- 修改用户界面文案时，避免出现 `Demo`、`演示`、`样例`、`技术组`、`答辩` 等内部实现或汇报口径词。
