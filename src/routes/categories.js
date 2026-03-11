/**
 * 分类接口路由
 */

const express = require('express');
const router = express.Router();
const facebookService = require('../services/facebook');

/**
 * GET /api/marketplace/categories
 * 获取分类列表
 */
router.get('/', async (req, res, next) => {
  try {
    const { location = 'New York' } = req.query;

    const categories = await facebookService.getCategories(location);

    res.json({
      categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({
      error: error.message,
      message: 'Failed to get categories'
    });
  }
});

module.exports = router;
