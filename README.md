# Shopping Platform (React + Node + MySQL)

一个可运行、可演示、可扩展的在线购物平台（Monorepo），包含：用户端、后台管理端、Node API、MySQL 持久化、真实商品同步、AI 图片搜商品。

## 技术栈

- 前端：React 18、TypeScript、Vite、React Router、Ant Design、Axios、Zustand
- 后端：Node.js、Express、MySQL(mysql2)、JWT、bcryptjs、multer、express-validator、dotenv
- AI：`@tensorflow/tfjs-node` + `@tensorflow-models/mobilenet`（失败自动降级到纯 Node 向量）
- 数据源：`https://dummyjson.com/products`

## 功能清单

### 用户端
- 注册、登录、JWT 鉴权
- 商品列表（搜索、分类、排序、分页）
- 商品详情
- 购物车增删改查
- 下单、我的订单、订单详情
- 个人中心
- AI 图片搜索（上传 -> 匹配 TopN）

### 后台管理端
- 管理员登录
- 商品管理（增删改查）
- 订单管理（状态流转：pending/paid/shipped/completed/cancelled）
- 用户管理（虚拟滚动表格）
- 远程商品同步（入库 + embedding 重建）

## 项目结构

```text
shopping-platform/
  client/                  # React + TS + Vite 前端
  server/                  # Express API 服务
  sql/
    init.sql               # 建表 SQL
    seed.sql               # 种子数据 SQL
  docs/
    api.md                 # API 说明
  package.json             # workspace 根脚本
  README.md
```

## 环境变量

### 1) 服务端 `server/.env`
复制 `server/.env.example` 为 `server/.env`。

关键变量：
- `PORT`：后端端口（默认 5000）
- `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`
- `JWT_SECRET/JWT_EXPIRES_IN`
- `ADMIN_USERNAME/ADMIN_EMAIL/ADMIN_PASSWORD`
- `PRODUCT_SYNC_URL`
- `AUTO_SYNC_PRODUCTS=true|false`

### 2) 前端 `client/.env`
复制 `client/.env.example` 为 `client/.env`。

- `VITE_API_BASE_URL=http://localhost:5000/api`

## MySQL 初始化

1. 创建数据库与表：
```bash
mysql -u root -p < sql/init.sql
```

2. 导入种子数据（可选）：
```bash
mysql -u root -p < sql/seed.sql
```

3. 启动服务端后会自动检查管理员账号，不存在则按 `.env` 初始化。

## 商品同步步骤

登录管理员后，可通过后台“商品管理 -> 同步远程商品”触发：
- 拉取 dummyjson 商品
- upsert 到 `products`
- 写入 `product_images`
- 读取商品主图生成 embedding
- 写入 `product_embeddings`

也可命令行执行：
```bash
npm run sync -w server
```

## 启动方式

```bash
npm install
npm run dev
```

默认地址：
- 前端：`http://localhost:5173`
- 后端：`http://localhost:5000`

## 默认管理员账号

由 `server/.env` 决定，默认：
- `admin@example.com`
- `Admin@123456`

## AI 图片搜索说明

流程：
1. `POST /api/ai-search/upload` 上传图片到 `server/uploads`
2. 前端拿到 `filePath`
3. `POST /api/ai-search/match` 计算上传图片 embedding
4. 与 `product_embeddings` 做余弦相似度
5. 返回 Top 10 与相似度分数

模型加载失败时会降级到可运行的纯 Node 向量方案，保证链路可用。

## 性能优化点

- 路由懒加载：`React.lazy + Suspense`
- 商品列表懒加载：IntersectionObserver 分批渲染
- 图片懒加载：`img loading="lazy"`
- 虚拟滚动：后台用户表 `Table virtual`
- React 性能 API：`React.memo`、`useMemo`、`useCallback`

## 截图占位

你可以在 `docs/screenshots/` 放置：
- `user-home.png`
- `user-products.png`
- `cart.png`
- `orders.png`
- `ai-search.png`
- `admin-products.png`
- `admin-orders.png`

## 常见报错排查

1. `ER_ACCESS_DENIED_ERROR`
- 检查 `server/.env` 的 MySQL 用户名密码

2. `Unknown database 'shopping_platform'`
- 先执行 `sql/init.sql`

3. 上传图片失败
- 检查文件大小（<=5MB）和类型（jpg/png/webp）

4. `401 token 无效`
- 重新登录；前端会自动清理失效 token

5. Windows 下 `EPERM` 构建/安装问题
- 关闭占用进程、使用管理员终端重试

## 后续优化方向

- 引入 Redis 做购物车缓存
- 订单支付回调（支付宝/微信 mock）
- 商品全文检索（Elasticsearch）
- 图片向量索引（Faiss/Milvus）
- 接入对象存储（OSS/S3）
- 添加单元测试与 E2E 测试
