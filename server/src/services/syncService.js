const axios = require('axios');
const productRepository = require('../repositories/productRepository');
const aiSearchService = require('./aiSearchService');
const { productSyncUrl } = require('../config/env');

const fallbackProducts = [
  {
    id: 'fallback-1',
    title: 'Fallback Phone',
    description: 'mock fallback product when remote source unavailable',
    price: 199,
    stock: 20,
    category: 'smartphones',
    brand: 'Fallback',
    thumbnail: 'https://dummyjson.com/image/400x300/0077ff/ffffff?text=Fallback+Phone',
    images: ['https://dummyjson.com/image/400x300/0077ff/ffffff?text=Fallback+Phone'],
    rating: 4.1
  },
  {
    id: 'fallback-2',
    title: 'Fallback Shoes',
    description: 'mock fallback product when remote source unavailable',
    price: 89,
    stock: 40,
    category: 'mens-shoes',
    brand: 'Fallback',
    thumbnail: 'https://dummyjson.com/image/400x300/009944/ffffff?text=Fallback+Shoes',
    images: ['https://dummyjson.com/image/400x300/009944/ffffff?text=Fallback+Shoes'],
    rating: 4.3
  }
];

function mapSourceProduct(product) {
  return {
    title: product.title,
    description: product.description || '',
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    category: product.category || 'misc',
    brand: product.brand || 'unknown',
    thumbnail: product.thumbnail || '',
    rating: Number(product.rating || 0),
    source_id: String(product.id)
  };
}

async function fetchProductsFromSource() {
  try {
    const response = await axios.get(productSyncUrl, { timeout: 20000 });
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data.products)) return response.data.products;
    return fallbackProducts;
  } catch (error) {
    return fallbackProducts;
  }
}

async function syncProducts() {
  const sourceProducts = await fetchProductsFromSource();
  const synced = [];

  for (const source of sourceProducts) {
    const mapped = mapSourceProduct(source);
    const productId = await productRepository.upsertSourceProduct(mapped);
    await productRepository.replaceProductImages(productId, Array.isArray(source.images) ? source.images : []);
    synced.push({ id: productId, title: mapped.title });
  }

  const embeddingResult = await aiSearchService.rebuildAllProductEmbeddings();

  return {
    total: synced.length,
    synced,
    embeddingResult,
    usedFallback: sourceProducts === fallbackProducts
  };
}

module.exports = {
  syncProducts
};
