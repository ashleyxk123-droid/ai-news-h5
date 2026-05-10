# 🤖 AI 科技新闻 H5

每天了解最新的人工智能资讯与科普，中英混合，移动端优先。

## 快速开始

```bash
cd ai-news-h5

# 安装依赖
npm install --cache ./.npm-cache

# 开发模式（前后端同时启动）
npm run dev
```

- 前端：`http://localhost:5173`
- 后端 API：`http://localhost:3001`

## 生产部署

```bash
npm run build --cache ./.npm-cache
npm start
```

Express 服务同时提供静态文件 + API，单端口部署（默认 3001）。

## 功能

| 功能 | 说明 |
|------|------|
| 新闻列表 | 12 个 RSS 源聚合（4 中文 + 8 英文），无限滚动加载 |
| 7 大分类 | LLM、机器人、学术、视觉、行业、安全、AGI — 关键词自动归类 |
| 文章详情 | HTML 渲染，来源/时间/分类标签，原文链接 |
| 搜索 | 400ms 防抖搜索，支持标题/摘要/来源名 |
| 书签收藏 | Zustand + localStorage 持久化，底部导航角标计数 |
| 暗色模式 | CSS 变量切换，跟随系统偏好 + 手动切换 |
| 每日摘要 | 按日期聚合 Top 头条 + 按分类展示 |
| PWA 离线 | Service Worker (NetworkFirst)，可添加到主屏幕 |
| ErrorBoundary | 全局错误捕获 + 一键刷新 |

## 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 架构 | npm workspaces monorepo | 前后端同仓，`npm run dev` 一键启动 |
| 前端 | React 18 + Vite + TailwindCSS 3 | H5 移动端优先，max-width: 480px |
| 状态管理 | Zustand + React Query | Zustand 管客户端状态，React Query 管服务端缓存 |
| 后端 | Express + tsx | RSS 代理 + JSON API，内存缓存 |
| RSS | rss-parser | 并发拉取 + node-cache 10 分钟 TTL |
| PWA | vite-plugin-pwa + Workbox | 自动生成 Service Worker，离线可用 |

## 项目结构

```
ai-news-h5/
├── package.json              # 根 workspace + concurrently 脚本
├── packages/
│   ├── server/               # Express 后端 (port 3001)
│   │   └── src/
│   │       ├── index.ts      # 入口，生产环境 serve 静态文件
│   │       ├── routes/news.ts
│   │       └── services/
│   │           ├── feedSources.ts   # 12 个 RSS 源定义
│   │           ├── rssFetcher.ts    # 并发拉取 + 缓存
│   │           ├── categorizer.ts   # 关键词自动分类
│   │           └── digestService.ts # 每日摘要生成
│   └── frontend/             # React + Vite 前端 (port 5173)
│       └── src/
│           ├── pages/        # HomePage, ArticlePage, SearchPage, BookmarksPage, DigestPage
│           ├── components/   # layout/, news/, digest/, common/
│           ├── store/        # Zustand stores (themeStore, bookmarkStore)
│           ├── hooks/        # useDarkMode, useBookmarks
│           └── styles/       # CSS 变量 + 暗色模式 + 文章排版
```

## RSS 源

| 中文源 | 英文源 |
|--------|--------|
| 机器之心 | Hacker News AI |
| 量子位 | TechCrunch AI |
| 雷锋网 AI | arXiv cs.AI |
| 36氪 AI | arXiv cs.CL |
| Synced (机器之心英文) | MIT Tech Review AI |
| | The Verge AI |
| | VentureBeat AI |

## API 接口

| 路由 | 说明 |
|------|------|
| `GET /api/news` | 新闻列表（支持 `category`, `page`, `lang`, `q` 参数） |
| `GET /api/news/:id` | 文章详情 + 相关推荐 |
| `GET /api/categories` | 分类列表 |
| `GET /api/digest` | 每日 AI 摘要 |
| `GET /api/search?q=关键词` | 搜索新闻 |
| `GET /api/sources` | RSS 源列表 |

## 构建产物

- JS: 359 KB (gzip 118 KB)
- CSS: 18 KB (gzip 4.4 KB)
- Service Worker + Workbox 自动生成


不能。localhost 只能在本机访问，别人看不到。                                                               
                                                                                                             
  要让别人看到，有几个方案：                                                                                    
  方案一：内网共享（同一 WiFi）                                                                              
  
  # 前端暴露到局域网
  npx vite --host 0.0.0.0
  然后访问 http://你的局域网IP:5173，同 WiFi 下的人都能看。

  方案二：生产模式单端口部署

  # 先构建前端
  npm run build

  # 启动生产服务（单端口 3001，自带静态文件）
  set NODE_ENV=production && npx tsx packages/server/src/index.ts

  得到 http://你的IP:3001，把这个 IP+端口暴露出去即可。如果部署到云服务器（VPS、Railway、Vercel
  等），别人就能通过公网域名访问。

  方案三：临时分享（最快）

  用 ngrok 等内网穿透工具，一条命令生成一个临时公网链接发给别人：

  npx ngrok http 5173

  会得到一个 https://xxx.ngrok.io 的公网地址，直接发给别人就行。