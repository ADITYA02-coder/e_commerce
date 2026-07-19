module.exports = app => {
  const carts = require("../controllers/cart.controller.js");
  const authJwt = require("../middlewares/authJwt");

  const router = require("express").Router();

  // Create or add to cart
  router.post("/", [authJwt.verifyToken], carts.create);

  // Retrieve all carts
  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], carts.findAll);

  // Retrieve active carts
  router.get("/active", [authJwt.verifyToken, authJwt.isAdmin], carts.findAllActive);

  // Retrieve single cart by User ID
  router.get("/user/:userId", [authJwt.verifyToken], carts.findByUserId);

  // Retrieve single cart by ID
  router.get("/:id", [authJwt.verifyToken], carts.findOne);

  // Update a cart
  router.put("/:id", [authJwt.verifyToken], carts.update);

  // Delete a cart
  router.delete("/:id", [authJwt.verifyToken], carts.delete);

  // Delete all carts
  router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], carts.deleteAll);

  app.use("/api/carts", router);
};
