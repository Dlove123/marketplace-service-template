/**
 * 搜索接口路由
 */

const express = require('express');
const router = express.Router();
const facebookService = require('../services/facebook');

/**
 * GET /api/marketplace/search
 * 搜索商品
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      query,
      location = 'New York',
      radius = 25,
      min_price,
      max_price,
      category
    } = req.query;

    if (!query) {
      return res.status(400).json({
        error: 'Missing required parameter: query'
      });
    }

    const results = await facebookService.search(query, {
      location,
      radius: parseInt(radius),
      minPrice: min_price ? parseFloat(min_price) : undefined,
      maxPrice: max_price ? parseFloat(max_price) : undefined,
      category
    });

    res.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      error: error.message,
      message: 'Failed to search Facebook Marketplace'
    });
  }
});

module.exports = router;
