import { API_URL } from "../config/api";

let productsCache = null;
const productByIdCache = new Map();

const normalizeProducts = (data) => (Array.isArray(data) ? data : []);

export const fetchProducts = async (force = false) => {
  if (!force && productsCache) {
    return productsCache;
  }

  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`);
  }

  productsCache = normalizeProducts(await response.json());
  productsCache.forEach((product) => {
    const id = product.id || product._id;
    if (id) productByIdCache.set(String(id), product);
  });
  return productsCache;
};

export const fetchProductById = async (id) => {
  const cacheKey = String(id);
  if (productByIdCache.has(cacheKey)) {
    return productByIdCache.get(cacheKey);
  }

  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to load product (${response.status})`);
  }

  const product = await response.json();
  if (product) productByIdCache.set(cacheKey, product);
  return product;
};
