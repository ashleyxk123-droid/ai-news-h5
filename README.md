# 🤖 AI 科技新闻 H5

每天了解最新的人工智能资讯与科普，中英混合，手机/桌面均可访问。

[![Deploy](https://github.com/ashleyxk123-droid/ai-news-h5/actions/workflows/deploy.yml/badge.svg)](https://github.com/ashleyxk123-droid/ai-news-h5/actions/workflows/deploy.yml)

**线上地址：https://ashleyxk123-droid.github.io/ai-news-h5/**

## 快速开始

```bash
git clone git@github.com:ashleyxk123-droid/ai-news-h5.git
cd ai-news-h5
npm install --cache ./.npm-cache
npm run dev
```

- 前端：`http://localhost:5173`
- 后端 API：`http://localhost:3001`

## 两种运行模式

### 开发模式（实时抓取）

```bash
npm run dev
```

Express 后端实时从 12 个 RSS 源抓取数据，每次刷新页面获取最新内容。

### 静态模式（GitHub Pages）

```bash
npm run generate-data   # 抓取 RSS + DeepSeek 翻译 → 生成静态 JSON
npm run build:static    # 构建纯静态前端
```

不依赖后端，前端直接读取预生成的 JSON 文件。用于 GitHub Pages 部署。

## 功能

| 功能 | 说明 |
|------|------|
| 新闻聚合 | 12 个 RSS 源（4 中文 + 8 英文），无限滚动加载 |
| 中英翻译 | DeepSeek API 批量翻译英文标题和摘要为中文 |
| 7 大分类 | LLM / 机器人 / 学术 / 视觉 / 行业 / AI安全 / AGI，关键词自动归类 |
| 文章详情 | HTML 渲染，中文翻译摘要卡片，原文链接，相关推荐 |
| 搜索 | 400ms 防抖，支持标题/摘要/来源名 |
| 书签收藏 | Zustand + localStorage 持久化，底部导航角标计数 |
| 暗色模式 | CSS 变量切换，跟随系统偏好 + 手动切换 |
| 每日摘要 | 按日期聚合 Top 头条 + 按分类展示 |
| 响应式布局 | 手机单列 + 底部导航；桌面侧边栏 + 三列卡片 |
| PWA 离线 | Service Worker (NetworkFirst)，可添加到主屏幕 |
| 自动更新 | GitHub Actions 每天 UTC 0:00 抓取最新数据并部署 |

## 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 架构 | npm workspaces monorepo | 前后端同仓，`npm run dev` 一键启动 |
| 前端 | React 18 + Vite + TailwindCSS 3 | 响应式布局，移动端 / 桌面端自适应 |
| 状态管理 | Zustand + React Query | Zustand 管客户端状态，React Query 管服务端缓存 |
| 路由 | React Router (HashRouter) | 兼容 GitHub Pages 不支持 SPA 路由 |
| 后端 | Express + tsx | RSS 代理 + JSON API，内存缓存 |
| RSS | rss-parser | 并发拉取 + node-cache 10 分钟 TTL |
| 翻译 | DeepSeek API (deepseek-chat) | 批量翻译英文文章标题和摘要 |
| 部署 | GitHub Actions + Pages | 定时抓取 → 翻译 → 构建 → 自动部署 |
| PWA | vite-plugin-pwa + Workbox | 自动生成 Service Worker，离线可用 |

## 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥，用于翻译英文文章 | 开发/构建时 |
| `VITE_STATIC` | 设为 `true` 时前端从静态 JSON 读取数据 | 静态模式 |
| `VITE_BASE` | 部署路径前缀（GitHub Pages 需设为 `/repo-name/`） | GitHub Pages |
| `NODE_ENV` | 设为 `production` 时 Express 同时 serve 静态文件 | 生产模式 |
| `PORT` | 服务器端口，默认 3001 | 可选 |

## 可用脚本

```bash
# 开发
npm run dev              # 同时启动前后端

# 数据
npm run generate-data    # 抓取 RSS + 翻译 → 生成静态 JSON

# 构建
npm run build            # 标准前端构建（需要后端 API）
npm run build:static     # 静态模式构建（读取 data/*.json）

# 生产
npm start                # 启动 Express 服务器
```

## 项目结构

```
ai-news-h5/
├── package.json                     # 根 workspace + concurrently 脚本
├── .github/workflows/deploy.yml     # GitHub Actions 自动部署
├── scripts/
│   ├── generate-data.ts             # RSS 抓取 + 生成静态 JSON
│   └── translate.ts                 # DeepSeek API 批量翻译
├── packages/
│   ├── server/                      # Express 后端 (port 3001)
│   │   └── src/
│   │       ├── index.ts             # 入口，生产环境 serve 静态文件
│   │       ├── routes/news.ts       # API 路由
│   │       └── services/
│   │           ├── feedSources.ts   # 12 个 RSS 源定义
│   │           ├── rssFetcher.ts    # 并发拉取 + 缓存
│   │           ├── categorizer.ts   # 关键词自动分类 (7大分类)
│   │           └── digestService.ts # 每日摘要生成
│   └── frontend/                    # React + Vite 前端 (port 5173)
│       ├── vite.config.ts           # Vite + PWA + GitHub Pages 配置
│       └── src/
│           ├── App.tsx              # QueryClient + Router + ErrorBoundary
│           ├── router.tsx           # HashRouter 路由配置
│           ├── pages/               # 5 个页面
│           ├── components/          # layout/, news/, digest/, common/
│           ├── store/               # Zustand (themeStore, bookmarkStore)
│           ├── hooks/               # useDarkMode, useBookmarks
│           └── styles/              # CSS 变量 + 暗色模式 + 文章排版
```

## 部署到 GitHub Pages

### 首次配置

1. 创建 GitHub 仓库，推送代码
2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
3. 仓库 Settings → Secrets → Actions → 添加 `DS_API_KEY`（DeepSeek API 密钥）

### 自动部署

推送代码后自动触发，也可以手动触发：

> Actions → Deploy to GitHub Pages → Run workflow

部署地址：`https://<用户名>.github.io/<仓库名>/`

### 定时更新

工作流每天 UTC 0:00（北京时间 8:00）自动运行：抓取 RSS → 翻译 → 构建 → 部署。

## RSS 源

**中文源：**

| ID | 名称 | 语言 |
|----|------|------|
| jiqizhixin | 机器之心 | zh |
| qbitai | 量子位 | zh |
| leiphone-ai | 雷锋网 AI | zh |
| 36kr-ai | 36氪 AI | zh |

**英文源：**

| ID | 名称 | 语言 |
|----|------|------|
| synced | Synced（机器之心英文） | en |
| hn-ai | Hacker News AI | en |
| techcrunch-ai | TechCrunch AI | en |
| arxiv-cs-ai | arXiv cs.AI | en |
| arxiv-cs-cl | arXiv cs.CL | en |
| mit-tr-ai | MIT Tech Review AI | en |
| theverge-ai | The Verge AI | en |
| venturebeat-ai | VentureBeat AI | en |

## API 接口

仅开发模式可用（`npm run dev`），静态模式从前端直接读取 JSON。

| 路由 | 说明 |
|------|------|
| `GET /api/news` | 新闻列表（支持 `category`, `page`, `lang`, `q` 参数） |
| `GET /api/news/:id` | 文章详情 + 相关推荐 |
| `GET /api/categories` | 分类列表 |
| `GET /api/digest` | 每日 AI 摘要 |
| `GET /api/search?q=关键词` | 搜索新闻 |
| `GET /api/sources` | RSS 源列表 |
| `GET /api/health` | 服务健康检查 |

## 构建产物

- JS: 362 KB (gzip 119 KB)
- CSS: 21 KB (gzip 5 KB)
- Service Worker + Workbox 自动生成
- 静态 JSON 数据文件（含翻译结果）
