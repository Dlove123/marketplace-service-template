/**
 * Facebook Marketplace爬虫服务
 * 使用移动代理绕过反爬
 */

const axios = require('axios');
const cheerio = require('cheerio');

class FacebookService {
  constructor() {
    this.baseUrl = 'https://www.facebook.com/marketplace';
    this.proxyUrl = process.env.PROXIES_SX_URL;
    this.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
  }

  /**
   * 搜索商品
   */
  async search(query, options = {}) {
    const {
      location = 'New York',
      radius = 25,
      minPrice,
      maxPrice,
      category
    } = options;

    const url = `${this.baseUrl}/search/${encodeURIComponent(query)}/`;
    
    const params = new URLSearchParams({
      location,
      radius: `${radius}mi`,
      ...(minPrice && { min_price: minPrice }),
      ...(maxPrice && { max_price: maxPrice }),
      ...(category && { category })
    });

    try {
      const response = await this._request(`${url}?${params}`);
      return this._parseSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error.message);
      throw new Error(`Facebook search failed: ${error.message}`);
    }
  }

  /**
   * 获取商品详情
   */
  async getListing(listingId) {
    const url = `${this.baseUrl}/item/${listingId}`;
    
    try {
      const response = await this._request(url);
      return this._parseListingDetail(response.data);
    } catch (error) {
      console.error('Listing detail error:', error.message);
      throw new Error(`Failed to get listing: ${error.message}`);
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories(location = 'New York') {
    const url = `${this.baseUrl}/category/${encodeURIComponent(location)}/`;
    
    try {
      const response = await this._request(url);
      return this._parseCategories(response.data);
    } catch (error) {
      console.error('Categories error:', error.message);
      throw new Error(`Failed to get categories: ${error.message}`);
    }
  }

  /**
   * 监控新上架
   */
  async getNewListings(query, since = '1h') {
    const results = await this.search(query);
    const sinceTime = new Date(Date.now() - this._parseSince(since));
    
    return results.filter(item => {
      const postedAt = new Date(item.posted_at);
      return postedAt >= sinceTime;
    });
  }

  /**
   * 发送请求（使用代理）
   */
  async _request(url) {
    return axios.get(url, {
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      proxy: this.proxyUrl ? {
        host: this.proxyUrl.split(':')[1].replace('//', ''),
        port: this.proxyUrl.split(':')[2] || 80
      } : undefined,
      timeout: 30000,
      maxRedirects: 5
    });
  }

  /**
   * 解析搜索结果
   */
  _parseSearchResults(html) {
    const $ = cheerio.load(html);
    const results = [];

    // 注意：这是示例解析逻辑，实际需要根据Facebook真实HTML结构调整
    $('div[role="article"]').each((i, elem) => {
      const item = {
        id: $(elem).attr('data-item-id') || '',
        title: $(elem).find('h3').text().trim() || '',
        price: parseFloat($(elem).find('[data-price]').attr('data-price')) || 0,
        currency: 'USD',
        location: $(elem).find('[data-location]').text().trim() || '',
        seller: {
          name: $(elem).find('[data-seller-name]').text().trim() || '',
          joined: $(elem).find('[data-seller-joined]').text().trim() || '',
          rating: $(elem).find('[data-seller-rating]').text().trim() || ''
        },
        condition: $(elem).find('[data-condition]').text().trim() || '',
        posted_at: $(elem).find('time').attr('datetime') || new Date().toISOString(),
        images: $(elem).find('img').map((_, img) => $(img).attr('src')).get(),
        url: $(elem).find('a').attr('href') || ''
      };

      if (item.id) {
        results.push(item);
      }
    });

    return {
      results,
      meta: {
        query: '',
        total_results: results.length,
        proxy: { ip: '', country: 'US', carrier: 'Mobile' }
      }
    };
  }

  /**
   * 解析商品详情
   */
  _parseListingDetail(html) {
    const $ = cheerio.load(html);
    
    return {
      id: $('article').attr('data-item-id') || '',
      title: $('h1').text().trim() || '',
      price: parseFloat($('[data-price]').attr('data-price')) || 0,
      description: $('[data-description]').text().trim() || '',
      seller: {
        name: $('[data-seller-name]').text().trim() || '',
        joined: $('[data-seller-joined]').text().trim() || '',
        rating: $('[data-seller-rating]').text().trim() || ''
      },
      location: $('[data-location]').text().trim() || '',
      condition: $('[data-condition]').text().trim() || '',
      posted_at: $('time').attr('datetime') || new Date().toISOString(),
      images: $('img').map((_, img) => $(img).attr('src')).get(),
      url: $('meta[property="og:url"]').attr('content') || ''
    };
  }

  /**
   * 解析分类
   */
  _parseCategories(html) {
    const $ = cheerio.load(html);
    const categories = [];

    $('[data-category]').each((i, elem) => {
      categories.push({
        id: $(elem).attr('data-category-id') || '',
        name: $(elem).attr('data-category') || '',
        url: $(elem).find('a').attr('href') || ''
      });
    });

    return categories;
  }

  /**
   * 解析时间范围
   */
  _parseSince(since) {
    const match = since.match(/(\d+)(h|d|w)/);
    if (!match) return 3600000; // 默认1小时

    const [, value, unit] = match;
    const multipliers = { h: 3600000, d: 86400000, w: 604800000 };
    return parseInt(value) * multipliers[unit];
  }
}

module.exports = new FacebookService();
