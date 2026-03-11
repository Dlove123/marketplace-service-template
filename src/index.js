/**
 * Facebook Marketplace Monitor API
 * Bounty任务 - $75
 */

const express = require('express');
const cors = require('cors');
const { x402Middleware } = require('./middleware/payment');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// x402支付验证中间件
app.use(x402Middleware(true));

// 路由
app.use('/api/marketplace/search', require('./routes/search'));
app.use('/api/marketplace/listing', require('./routes/listing'));
app.use('/api/marketplace/categories', require('./routes/categories'));
app.use('/api/marketplace/new', require('./routes/monitor'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 Facebook Marketplace API running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
});

module.exports = app;
