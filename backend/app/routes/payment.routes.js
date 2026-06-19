module.exports = app => {
  const payments = require("../controllers/payment.controller.js");
  const { authJwt } = require("../middlewares");

  var router = require("express").Router();

  // Create a payment
  router.post("/", [authJwt.verifyToken], payments.create);

  // Get payment details
  router.get("/:id", [authJwt.verifyToken], payments.findOne);

  // Get user's payments
  router.get("/", [authJwt.verifyToken], payments.findByUser);

  // Update payment status (webhook or admin)
  router.put("/:id/status", payments.updateStatus);

  // Get all payments (admin only)
  router.get("/admin/all", [authJwt.verifyToken, authJwt.isAdmin], payments.findAll);

  app.use("/api/payments", router);
};
