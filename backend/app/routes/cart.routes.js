module.exports = app => {
  const carts = require("../controllers/cart.controller.js");

  const router = require("express").Router();

  // Create or add to cart
  router.post("/", carts.create);

  // Retrieve all carts
  router.get("/", carts.findAll);

  // Retrieve active carts
  router.get("/active", carts.findAllActive);

  // Retrieve single cart by User ID
  router.get("/user/:userId", carts.findByUserId);

  // Retrieve single cart by ID
  router.get("/:id", carts.findOne);

  // Update a cart
  router.put("/:id", carts.update);

  // Delete a cart
  router.delete("/:id", carts.delete);

  // Delete all carts
  router.delete("/", carts.deleteAll);

  app.use("/api/carts", router);
};
