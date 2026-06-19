module.exports = app => {
  const qpapers = require("../controllers/qpaper.controller.js");
  const { createUploadMiddleware } = require("../config/upload.config.js");

  const uploadFile = createUploadMiddleware("qpaper_uploads");

  var router = require("express").Router();
  
  // Create a new qpaper with file upload
  router.post("/upload", uploadFile.single("file"), qpapers.create);
  
  // Retrieve all qpapers
  router.get("/upload", qpapers.findAll);
  
  // Retrieve one qpaper by id
  router.get("/upload/:id", qpapers.findOne);

  // Update a qpaper with id
  router.put("/upload/:id", qpapers.update);

  // Delete a qpaper with id
  router.delete("/upload/:id", qpapers.delete);

  app.use("/api/qpapers", router);
};
