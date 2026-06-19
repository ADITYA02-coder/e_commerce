module.exports = app => {
  const products = require("../controllers/product.controller.js");
  const { createUploadMiddleware } = require("../config/upload.config.js");

  const uploadFile = createUploadMiddleware("product_uploads");

  var router = require("express").Router();
  
  // Create a new product with file upload
  router.post("/", uploadFile.single("file"), products.create);

  // Retrieve all products (root endpoint for frontend compatibility)
  router.get("/", products.findAll);

  // Filter products by specifications
  router.get("/filter/search", products.filterBySpecs);

  // Get featured products
  router.get("/featured/all", products.getFeatured);

  // Get best-selling products
  router.get("/bestselling/all", products.getBestSelling);

  // Get products by brand
  router.get("/brand/:brand", products.findByBrand);

  // Retrieve all published products
  router.get("/active/all", products.findAllActive);

  // Retrieve all products (alternate endpoint)
  router.get("/list/all", products.findAll);

  // Retrieve a single product with id
  router.get("/:id", products.findOne);

  // Update a product with id
  router.put("/:id", products.update);

  // Update product stock
  router.put("/:id/stock", products.updateStock);

  // Delete a product with id
  router.delete("/:id", products.delete);

  // Delete all products
  router.delete("/", products.deleteAll);

  app.use("/api/products", router);
};
