# CLAUDE.md

写给在本仓库工作的 AI / 协作者，说明定位、目录约定和常用命令。

## 仓库定位

小丑牌（Balatro 核心循环）教学项目，纯前端单机网页游戏。**Vue 3 + Vite + GSAP**，无后端、无登录、无 API key。需求与设计锁定在根目录两份 HTML 文档里：

- `01-第1轮-PRD-小丑牌核心循环(1).html` —— 产品需求（玩法/数值/文案/范围，含大量「锁定」项）
- `01-第1轮-DESIGN-小丑牌核心循环(1).html` —— 视觉规范（配色 token / 布局 / 字体 / 计分动画时序）

改动玩法、数值、文案、视觉前，先对照这两份文档的「锁定」条目；它们是唯一事实来源。

## 目录约定

```
src/
  main.js              入口
  style.css            全局样式 + design tokens + 按钮系统 + 飞字
  App.vue              根布局（sidebar + 右主区 grid）、状态机路由、设置按钮
  fx.js                GSAP 动画：飞字 / 发牌飞入 / FLIP / RAF 数字插值 / 动画速度倍率
  store/game.js        唯一状态源（reactive）+ 全部动作 + 出牌计分时间线
  data/
    cards.js           52 张牌、点数、洗牌
    handTypes.js       9 种牌型识别（支持 1-5 张）
    jokers.js          6 张 Joker（字段+数值锁定）+ 稀有度色板
    blinds.js          3 关盲注 + 通关奖励
    scoring.js         纯计分公式 + AI 枚举 bestPlay + 商店建议
  components/          SideBar / JokerRow / JokerCard / PlayArea / HandArea /
                       PlayingCard / Shop / EndScreen / SettingsModal
```

约定：
- 状态与逻辑集中在 `store/game.js`，组件只读 `state` + 调动作，不要在组件里散落游戏规则。
- 动画通过 `fx.js` 用 `data-id` / `.deck-pile` / `.chips-block` / `.mult-block` 等选择器定位 DOM，组件需保留这些类名/属性。
- `data/` 下全是纯函数模块（不依赖 Vue），可单独 import 做单测。

## 常用命令

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # 必须 0 error 0 warning
npm run preview
```

## 提交约定

每轮一个 commit，message 格式 `feat: 第 N 轮 - 主题（v1.X.0）`。除本文件和 README.md 外不要新增其他 .md 文档。
