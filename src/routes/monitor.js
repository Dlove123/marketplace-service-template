/**
 * 监控新上架接口路由
 */

const express = require('express');
const router = express.Router();
const facebookService = require('../services/facebook');

/**
 * GET /api/marketplace/new
 * 获取新上架商品
 */
router.get('/', async (req, res, next) => {
  try {
    const { query, since = '1h' } = req.query;

    if (!query) {
      return res.status(400).json({
        error: 'Missing required parameter: query'
      });
    }

    const listings = await facebookService.getNewListings(query, since);

    res.json({
      results: listings,
      meta: {
        query,
        since,
        total_results: listings.length
      }
    });
  } catch (error) {
    console.error('Monitor API error:', error);
    res.status(500).json({
      error: error.message,
      message: 'Failed to get new listings'
    });
  }
});

module.exports = router;
