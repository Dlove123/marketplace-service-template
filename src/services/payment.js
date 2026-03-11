/**
 * x402支付服务
 */

class X402Payment {
  constructor() {
    this.wallet = process.env.X402_WALLET;
    this.prices = {
      search: 0.01,      // $0.01 USDC
      listing: 0.005,    // $0.005 USDC
      monitor: 0.02      // $0.02 USDC
    };
  }

  /**
   * 验证支付
   */
  async verifyPayment(req) {
    const x402Header = req.headers['x-x402'];
    
    if (!x402Header) {
      return { valid: false, message: 'Missing x402 payment header' };
    }

    try {
      // 解析x402支付证明
      const payment = JSON.parse(Buffer.from(x402Header, 'base64').toString());
      
      // 验证签名
      const isValid = await this._verifySignature(payment);
      
      if (!isValid) {
        return { valid: false, message: 'Invalid payment signature' };
      }

      // 验证金额
      const requiredAmount = this._getRequiredAmount(req.path);
      if (payment.amount < requiredAmount) {
        return { 
          valid: false, 
          message: `Insufficient payment. Required: ${requiredAmount}, Got: ${payment.amount}` 
        };
      }

      return { valid: true, payment };
    } catch (error) {
      return { valid: false, message: `Payment verification failed: ${error.message}` };
    }
  }

  /**
   * 获取所需金额
   */
  _getRequiredAmount(path) {
    if (path.includes('/search')) return this.prices.search;
    if (path.includes('/listing')) return this.prices.listing;
    if (path.includes('/new')) return this.prices.monitor;
    if (path.includes('/categories')) return 0.001; // 低价或免费
    return 0.01; // 默认价格
  }

  /**
   * 验证签名（简化版）
   */
  async _verifySignature(payment) {
    // 实际实现需要验证加密签名
    // 这里使用简化验证
    return payment.signature && payment.amount && payment.payer;
  }

  /**
   * 生成支付请求
   */
  generatePaymentRequest(endpoint, amount) {
    return {
      endpoint,
      amount,
      currency: 'USDC',
      network: 'Solana',
      timestamp: Date.now()
    };
  }
}

module.exports = new X402Payment();
