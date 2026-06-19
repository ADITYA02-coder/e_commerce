module.exports = app => {
  const reviews = require("../controllers/review.controller.js");
  const { authJwt } = require("../middlewares");

  var router = require("express").Router();

  // Create a review (must be logged in)
  router.post("/", [authJwt.verifyToken], reviews.create);

  // Get reviews for a product
  router.get("/product/:productId", reviews.findByProduct);

  // Get current user's reviews
  router.get("/my-reviews", [authJwt.verifyToken], reviews.findByUser);

  // Update a review
  router.put("/:id", [authJwt.verifyToken], reviews.update);

  // Delete a review
  router.delete("/:id", [authJwt.verifyToken], reviews.delete);

  app.use("/api/reviews", router);
};
