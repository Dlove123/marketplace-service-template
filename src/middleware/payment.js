/**
 * x402支付中间件
 */

const paymentService = require('../services/payment');

/**
 * x402支付验证中间件
 */
function x402Middleware(required = true) {
  return async (req, res, next) => {
    // 跳过健康检查
    if (req.path === '/health') {
      return next();
    }

    // 验证支付
    const result = await paymentService.verifyPayment(req);

    if (!result.valid) {
      if (required) {
        return res.status(402).json({
          error: 'Payment Required',
          message: result.message,
          paymentRequired: {
            amount: paymentService._getRequiredAmount(req.path),
            currency: 'USDC',
            network: 'Solana',
            instructions: 'Include x402 payment header with your request'
          }
        });
      }
      // 如果非必需，添加警告但继续
      res.setHeader('X-Payment-Warning', result.message);
    }

    // 添加支付信息到响应
    res.setHeader('X-Payment-Status', result.valid ? 'verified' : 'skipped');
    
    next();
  };
}

module.exports = { x402Middleware };
