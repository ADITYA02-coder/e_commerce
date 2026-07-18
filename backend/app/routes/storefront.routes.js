module.exports = (app) => {
  const storefront = require("../controllers/storefront.controller.js");
  const router = require("express").Router();

  // Amazon-style storefront feed
  router.get("/home", storefront.getHomeFeed);

  // Category discovery cards with live product counts and cover images
  router.get("/categories", storefront.getCategories);

  // Marketplace search with filters, sort, and pagination
  router.get("/search", storefront.searchProducts);

  // Deals endpoint for deal strips/widgets
  router.get("/deals", storefront.getDeals);

  app.use("/api/storefront", router);
};
