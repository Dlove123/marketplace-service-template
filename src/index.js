/**
 * Facebook Marketplace Monitor API
 * Bounty任务 - $75
 */

const express = require('express');
const cors = require('cors');
const x402 = require('x402');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// x402支付中间件
app.use(x402.middleware({
  price: {
    search: 0.01,      // $0.01 USDC per search
    listing: 0.005,    // $0.005 USDC per listing
    monitor: 0.02      // $0.02 USDC per monitor check
  }
}));

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
