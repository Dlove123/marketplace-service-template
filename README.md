# Facebook Marketplace Monitor API

> Bounty任务开发项目 - $75

---

## 📋 任务要求

```
GET /api/marketplace/search?query=iphone+15&location=New+York&radius=25mi
GET /api/marketplace/listing/:id
GET /api/marketplace/categories?location=New+York
GET /api/marketplace/new?query=keyword&since=1h
```

---

## 🏗️ 技术架构

```
• 后端：Node.js + Express
• 代理：Proxies.sx移动代理
• 支付：x402 + Solana USDC
• 部署：Vercel（免费）
```

---

## 📁 项目结构

```
facebook-marketplace-api/
├── src/
│   ├── index.js          # 主入口
│   ├── routes/
│   │   ├── search.js     # 搜索接口
│   │   ├── listing.js    # 详情接口
│   │   ├── categories.js # 分类接口
│   │   └── monitor.js    # 监控接口
│   ├── services/
│   │   ├── facebook.js   # Facebook爬虫
│   │   ├── proxy.js      # 代理管理
│   │   └── payment.js    # x402支付
│   └── utils/
│       ├── parser.js     # 数据解析
│       └── logger.js     # 日志
├── package.json
├── vercel.json
└── README.md
```

---

## 🚀 开发状态

- [ ] 项目初始化
- [ ] 基础爬虫开发
- [ ] 反爬绕过
- [ ] API接口实现
- [ ] x402支付集成
- [ ] 测试
- [ ] 部署
- [ ] PR提交

---

*开发中...*
