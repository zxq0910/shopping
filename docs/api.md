# API 文档简版

## 认证
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

## 商品
- GET /api/products
- GET /api/products/:id
- GET /api/products/categories
- GET /api/products/search?q=
- POST /api/products/sync (admin)

## 购物车
- GET /api/cart
- POST /api/cart
- PUT /api/cart/:id
- DELETE /api/cart/:id

## 订单
- POST /api/orders
- GET /api/orders
- GET /api/orders/:id

## 后台
- GET /api/admin/users
- GET /api/admin/orders
- PUT /api/admin/orders/:id/status
- GET /api/admin/products
- POST /api/admin/products
- PUT /api/admin/products/:id
- DELETE /api/admin/products/:id

## AI 搜图
- POST /api/ai-search/upload
- POST /api/ai-search/match
