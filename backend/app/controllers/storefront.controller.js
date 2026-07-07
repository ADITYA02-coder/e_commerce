const db = require("../models");

const Product = db.products;
const Order = db.orders;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeProduct = (product) => {
  const price = toNumber(product.price, 0);
  const discount = toNumber(product.discount, 0);
  const reviewCount = toNumber(product.reviewCount, 0);
  const rating = toNumber(product.rating, 0);
  const stock = toNumber(product.stock, 0);

  const finalDiscount = discount > 0 ? discount : price >= 1000 ? 10 : 0;
  const discountedPrice =
    finalDiscount > 0
      ? Number((price - (price * finalDiscount) / 100).toFixed(2))
      : price;

  return {
    ...product,
    price,
    rating,
    stock,
    reviewCount,
    discount: finalDiscount,
    discountedPrice,
    inStock: stock > 0
  };
};

const buildSort = (sort) => {
  if (sort === "price_asc") return { price: 1 };
  if (sort === "price_desc") return { price: -1 };
  if (sort === "rating") return { rating: -1, reviewCount: -1 };
  if (sort === "popular") return { reviewCount: -1, rating: -1, createdAt: -1 };
  return { createdAt: -1 };
};

exports.getHomeFeed = async (req, res) => {
  try {
    const limit = Math.max(4, Math.min(toNumber(req.query.limit, 12), 30));
    const activeProducts = await Product.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(120)
      .lean();

    const products = activeProducts.map(normalizeProduct);

    const byDeals = [...products].sort((a, b) => {
      if (b.discount !== a.discount) return b.discount - a.discount;
      return a.discountedPrice - b.discountedPrice;
    });

    const byRating = [...products].sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });

    let bestSellerProductIds = [];
    try {
      const bestSellerAgg = await Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            soldUnits: { $sum: "$items.quantity" }
          }
        },
        { $sort: { soldUnits: -1 } },
        { $limit: limit }
      ]);
      bestSellerProductIds = bestSellerAgg.map((item) => String(item._id));
    } catch (orderError) {
      bestSellerProductIds = [];
    }

    const bestSellerLookup = new Map(products.map((p) => [String(p._id), p]));
    const bestSellers = bestSellerProductIds
      .map((id) => bestSellerLookup.get(id))
      .filter(Boolean);

    const fallbackBestSellers = bestSellers.length ? bestSellers : byRating.slice(0, limit);

    const categoryCounter = {};
    const brandCounter = {};

    products.forEach((product) => {
      if (product.category) {
        categoryCounter[product.category] = (categoryCounter[product.category] || 0) + 1;
      }
      if (product.brand) {
        brandCounter[product.brand] = (brandCounter[product.brand] || 0) + 1;
      }
    });

    const topCategories = Object.entries(categoryCounter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const topBrands = Object.entries(brandCounter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return res.status(200).send({
      hero: byDeals[0] || null,
      topDeals: byDeals.slice(0, limit),
      bestSellers: fallbackBestSellers,
      trending: byRating.slice(0, limit),
      recentlyAdded: products.slice(0, limit),
      topCategories,
      topBrands,
      stats: {
        totalProducts: products.length,
        inStockProducts: products.filter((p) => p.inStock).length
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "Failed to build storefront home feed"
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const category = (req.query.category || "").trim();
    const brand = (req.query.brand || "").trim();
    const sort = (req.query.sort || "newest").trim();
    const page = Math.max(1, toNumber(req.query.page, 1));
    const limit = Math.max(1, Math.min(toNumber(req.query.limit, 24), 60));
    const minPrice = req.query.minPrice !== undefined ? toNumber(req.query.minPrice, 0) : null;
    const maxPrice = req.query.maxPrice !== undefined ? toNumber(req.query.maxPrice, Number.MAX_SAFE_INTEGER) : null;

    const filters = { active: true };

    if (q) {
      const safeQuery = escapeRegex(q);
      filters.$or = [
        { name: { $regex: safeQuery, $options: "i" } },
        { brand: { $regex: safeQuery, $options: "i" } },
        { category: { $regex: safeQuery, $options: "i" } },
        { description: { $regex: safeQuery, $options: "i" } }
      ];
    }

    if (category) {
      filters.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
    }

    if (brand) {
      filters.brand = { $regex: `^${escapeRegex(brand)}$`, $options: "i" };
    }

    if (minPrice !== null || maxPrice !== null) {
      filters.price = {};
      if (minPrice !== null) filters.price.$gte = minPrice;
      if (maxPrice !== null) filters.price.$lte = maxPrice;
    }

    if (String(req.query.inStock || "").toLowerCase() === "true") {
      filters.stock = { $gt: 0 };
      filters.availability = true;
    }

    const total = await Product.countDocuments(filters);
    const skip = (page - 1) * limit;

    const items = await Product.find(filters)
      .sort(buildSort(sort))
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).send({
      items: items.map(normalizeProduct),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit))
      },
      query: {
        q,
        category,
        brand,
        sort,
        minPrice,
        maxPrice,
        inStock: String(req.query.inStock || "").toLowerCase() === "true"
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "Failed to search products"
    });
  }
};

exports.getDeals = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(toNumber(req.query.limit, 20), 60));

    const items = await Product.find({ active: true })
      .sort({ discount: -1, price: 1, createdAt: -1 })
      .limit(limit * 3)
      .lean();

    const deals = items
      .map(normalizeProduct)
      .sort((a, b) => {
        if (b.discount !== a.discount) return b.discount - a.discount;
        return a.discountedPrice - b.discountedPrice;
      })
      .slice(0, limit);

    return res.status(200).send({ items: deals, count: deals.length });
  } catch (error) {
    return res.status(500).send({
      message: error.message || "Failed to fetch deals"
    });
  }
};
