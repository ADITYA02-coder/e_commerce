module.exports = app => {
  const orders = require("../controllers/order.controller.js");
  const authJwt = require("../middlewares/authJwt");

  const router = require("express").Router();

  // Create a new Order
  router.post("/", [authJwt.verifyToken], orders.create);

  // Retrieve all Orders
  router.get("/", [authJwt.verifyToken], orders.findAll);

  // Retrieve all active Orders
  router.get("/active", [authJwt.verifyToken], orders.findAllActive);

  // Retrieve a single Order with id
  router.get("/:id", [authJwt.verifyToken], orders.findOne);

  // Update an Order with id
  router.put("/:id", [authJwt.verifyToken], orders.update);

  // Delete an Order with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], orders.delete);

  // Delete all Orders
  router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], orders.deleteAll);

  app.use("/api/orders", router);
};
