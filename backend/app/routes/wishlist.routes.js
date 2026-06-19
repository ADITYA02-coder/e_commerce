module.exports = app => {
  const wishlists = require("../controllers/wishlist.controller.js");
  const { authJwt } = require("../middlewares");

  var router = require("express").Router();

  // Get user's wishlist
  router.get("/", [authJwt.verifyToken], wishlists.getWishlist);

  // Add to wishlist
  router.post("/add", [authJwt.verifyToken], wishlists.addToWishlist);

  // Remove from wishlist
  router.post("/remove", [authJwt.verifyToken], wishlists.removeFromWishlist);

  // Clear wishlist
  router.delete("/", [authJwt.verifyToken], wishlists.clearWishlist);

  app.use("/api/wishlist", router);
};
