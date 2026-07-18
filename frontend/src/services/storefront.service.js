import { API_URL } from "../config/api";
import { fetchProducts } from "./productCache";

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    query.append(key, String(value));
  });
  return query.toString();
};

const normalizeItems = (items) => (Array.isArray(items) ? items : []);

export const fetchStorefrontHome = async (params = {}) => {
  const query = buildQuery(params);
  const url = `${API_URL}/storefront/home${query ? `?${query}` : ""}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Home feed request failed (${response.status})`);
    }

    const data = await response.json();
    return {
      hero: data.hero || null,
      topDeals: normalizeItems(data.topDeals),
      bestSellers: normalizeItems(data.bestSellers),
      trending: normalizeItems(data.trending),
      recentlyAdded: normalizeItems(data.recentlyAdded),
      topCategories: normalizeItems(data.topCategories),
      topBrands: normalizeItems(data.topBrands),
      stats: data.stats || { totalProducts: 0, inStockProducts: 0 }
    };
  } catch (error) {
    const fallbackProducts = await fetchProducts();
    return {
      hero: fallbackProducts[0] || null,
      topDeals: fallbackProducts.slice(0, 8),
      bestSellers: fallbackProducts.slice(0, 8),
      trending: fallbackProducts.slice(0, 8),
      recentlyAdded: fallbackProducts.slice(0, 12),
      topCategories: [],
      topBrands: [],
      stats: {
        totalProducts: fallbackProducts.length,
        inStockProducts: fallbackProducts.filter((item) => Number(item.stock || 0) > 0).length
      }
    };
  }
};

export const searchStorefrontProducts = async (params = {}) => {
  const query = buildQuery(params);
  const url = `${API_URL}/storefront/search${query ? `?${query}` : ""}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Search request failed (${response.status})`);
    }

    const data = await response.json();
    return {
      items: normalizeItems(data.items),
      pagination: data.pagination || {
        total: 0,
        page: 1,
        limit: Number(params.limit || 24),
        totalPages: 1
      }
    };
  } catch (error) {
    const fallbackProducts = await fetchProducts();
    return {
      items: fallbackProducts,
      pagination: {
        total: fallbackProducts.length,
        page: 1,
        limit: fallbackProducts.length,
        totalPages: 1
      }
    };
  }
};

export const fetchStorefrontCategories = async () => {
  const response = await fetch(`${API_URL}/storefront/categories`);
  if (!response.ok) {
    throw new Error(`Category request failed (${response.status})`);
  }

  const data = await response.json();
  return normalizeItems(data.items);
};
