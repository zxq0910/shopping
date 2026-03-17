const axios = require('axios');
const fs = require('fs');
const path = require('path');
const embeddingRepository = require('../repositories/embeddingRepository');
const productRepository = require('../repositories/productRepository');
const { cosineSimilarity } = require('../utils/vector');
const AppError = require('../utils/AppError');

let modelPromise = null;
let tfRuntime = null;

async function loadModelSafe() {
  if (!modelPromise) {
    modelPromise = (async () => {
      try {
        const tf = require('@tensorflow/tfjs-node');
        const mobilenet = require('@tensorflow-models/mobilenet');
        const model = await mobilenet.load({ version: 2, alpha: 1.0 });
        tfRuntime = tf;
        return model;
      } catch (error) {
        tfRuntime = null;
        return null;
      }
    })();
  }
  return modelPromise;
}

function fallbackEmbeddingFromBuffer(buffer) {
  const size = 128;
  const vector = new Array(size).fill(0);
  for (let i = 0; i < buffer.length; i += 1) {
    vector[i % size] += buffer[i] / 255;
  }
  const max = Math.max(...vector, 1);
  return vector.map((x) => x / max);
}

async function embeddingFromBuffer(buffer) {
  const model = await loadModelSafe();
  if (!model || !tfRuntime) return fallbackEmbeddingFromBuffer(buffer);

  try {
    const imageTensor = tfRuntime.node.decodeImage(buffer, 3);
    const resized = tfRuntime.image.resizeBilinear(imageTensor, [224, 224]);
    const batched = resized.expandDims(0);
    const embedding = model.infer(batched, true);
    const data = Array.from(await embedding.data());

    imageTensor.dispose();
    resized.dispose();
    batched.dispose();
    embedding.dispose();

    return data;
  } catch (error) {
    return fallbackEmbeddingFromBuffer(buffer);
  }
}

async function fetchImageBuffer(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 20000 });
  return Buffer.from(response.data);
}

async function createProductEmbedding(productId, imageUrl) {
  const imageBuffer = await fetchImageBuffer(imageUrl);
  const embedding = await embeddingFromBuffer(imageBuffer);
  await embeddingRepository.upsertProductEmbedding({
    product_id: productId,
    image_url: imageUrl,
    embedding_json: JSON.stringify(embedding)
  });
}

async function rebuildAllProductEmbeddings() {
  const products = await productRepository.listAllProductsWithImage();
  const failures = [];

  for (const product of products) {
    const imageUrl = product.image_url || product.thumbnail;
    if (!imageUrl) continue;
    try {
      await createProductEmbedding(product.id, imageUrl);
    } catch (error) {
      failures.push({ productId: product.id, reason: error.message });
    }
  }

  return {
    total: products.length,
    failed: failures.length,
    failures,
    modelLoaded: Boolean(tfRuntime)
  };
}

async function matchByUploadFile(filePath, topN = 10) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new AppError('上传文件不存在', 400, 'FILE_NOT_FOUND');
  }

  const buffer = fs.readFileSync(absolutePath);
  const targetEmbedding = await embeddingFromBuffer(buffer);
  const embeddingRows = await embeddingRepository.listEmbeddings();

  const matches = embeddingRows
    .map((row) => {
      let vector = [];
      try {
        vector = JSON.parse(row.embedding_json);
      } catch (error) {
        vector = [];
      }

      return {
        product_id: row.product_id,
        title: row.title,
        price: row.price,
        thumbnail: row.thumbnail,
        category: row.category,
        rating: row.rating,
        similarity: Number(cosineSimilarity(targetEmbedding, vector).toFixed(4))
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);

  return matches;
}

module.exports = {
  loadModelSafe,
  rebuildAllProductEmbeddings,
  createProductEmbedding,
  matchByUploadFile
};
