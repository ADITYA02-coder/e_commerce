module.exports = app => {
  const addresses = require("../controllers/address.controller.js");
  const authJwt = require("../middlewares/authJwt");

  var router = require("express").Router();

  // Create a new student
  router.post("/", [authJwt.verifyToken], addresses.create);

  // Retrieve all students
  router.get("/", [authJwt.verifyToken], addresses.findAll);

  // Retrieve all published students
  router.get("/active", [authJwt.verifyToken], addresses.findAllActive);

  // Retrieve a single student with id
  router.get("/:id", [authJwt.verifyToken], addresses.findOne);

  // Update a student with id
  router.put("/:id", [authJwt.verifyToken], addresses.update);

  // Delete a student with id
  router.delete("/:id", [authJwt.verifyToken], addresses.delete);

  // Create a new student
  router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], addresses.deleteAll);

  app.use("/api/addresses", router);
};
