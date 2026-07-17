# 智绘适老网页前端

这是“智绘适老”网页前端，核心入口包括：

- 扫描评估：确认老人情况和空间，按关键视角完成采集，生成风险报告。
- 方案商城：根据风险项推荐适老产品和服务方案。
- 效果社区：展示复扫案例、改造提问和服务评价。

## 线上演示

固定体验地址：<https://batch-li.github.io/web-demo/>

展示二维码应始终编码该固定地址。`main` 分支更新后，GitHub Actions 会重新构建并发布到同一地址，因此不需要重复生成二维码。

## 本地运行

建议使用 Node.js 20.19 或更高版本。项目已包含 `package-lock.json`，可按以下步骤安装并启动：

```bash
npm install
npm run dev
```

启动后打开终端输出的本地地址：

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
src/demoData.js     商品、风险、社区等页面数据
src/logic.js        风险报告、方案匹配等逻辑
src/styles.css      页面样式
public/assets/      本地图片素材
```

## 维护说明

- 不提交 `node_modules/` 和 `dist/`。
- 修改图片素材后，需要同步检查 `src/demoData.js` 中的图片路径。
- 修改用户界面文案时，应避免出现内部实现、汇报口径或开发过程相关词汇。
- 推送到 `main` 前运行 `npm test` 和 `npm run build`；推送后确认 `Deploy GitHub Pages` 工作流执行成功。
