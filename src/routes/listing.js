/**
 * 商品详情接口路由
 */

const express = require('express');
const router = express.Router();
const facebookService = require('../services/facebook');

/**
 * GET /api/marketplace/listing/:id
 * 获取商品详情
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'Missing required parameter: id'
      });
    }

    const listing = await facebookService.getListing(id);

    if (!listing || !listing.id) {
      return res.status(404).json({
        error: 'Listing not found'
      });
    }

    res.json(listing);
  } catch (error) {
    console.error('Listing API error:', error);
    res.status(500).json({
      error: error.message,
      message: 'Failed to get listing details'
    });
  }
});

module.exports = router;
