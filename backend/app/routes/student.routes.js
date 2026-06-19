module.exports = app => {
  const students = require("../controllers/student.controller.js");
  const { createUploadMiddleware } = require("../config/upload.config.js");

  const uploadFile = createUploadMiddleware("student_uploads");

  var router = require("express").Router();
  
  // Create a new student with file upload
  router.post("/", uploadFile.single("file"), students.create);

  // Retrieve all students
  router.get("/", students.findAll);

  // Retrieve all published students
  router.get("/active", students.findAllActive);

  // Retrieve a single student with id
  router.get("/:id", students.findOne);

  // Update a student with id
  router.put("/:id", students.update);

  // Delete a student with id
  router.delete("/:id", students.delete);

  // Delete all students
  router.delete("/", students.deleteAll);

  app.use("/api/students", router);
};
