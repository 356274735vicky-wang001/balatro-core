# 🃏 小丑牌（Balatro 核心循环）

Balatro 风格的「扑克 + 小丑牌组合」单机网页游戏。从 0 金币、0 张小丑牌开始，出 5 张以内的扑克牌型 + 持有的 Joker 加成攒分，4 手内打到盲注目标分即通关，进商店买卡变强，依次推进小盲注（300）→ 中盲注（500）→ 大盲注（800）三关。

本仓库是教学课程「第 1 轮」的产物：完整核心循环 + 4 类出牌动效 + 设置面板 + 本地启发式 AI 出牌。技术栈 **Vue 3 + Vite + GSAP**，纯前端、无后端、无需登录、无需 API key。

## 安装

需要 Node.js（建议 18+）。

```bash
npm install
```

## 使用

```bash
npm run dev      # 启动开发服务器，默认 http://localhost:5173/
npm run build    # 生产构建，产物在 dist/
npm run preview  # 本地预览构建产物
```

部署到 GitHub Pages 时用 `DEPLOY_TARGET=pages npm run build`（`vite.config.js` 会把 base 切到仓库子路径）。

### 玩法

- 点手牌选 1-5 张 → 绿色「出牌」结算，看逐张高亮 + 飞字 + 公式爆分
- 紫色「🤖 AI 出牌」自动枚举最优组合（本地启发式，不联网）
- 攒够目标分进商店买 Joker（或「🤖 AI 建议」），「跳过 →」打下一关
- 右上角 ⚙️ 设置：BGM/SFX 音量、动画速度（慢/普通/快）、出牌公式预览，设置持久化到 localStorage
