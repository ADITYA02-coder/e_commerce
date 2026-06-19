const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Image filter for multer
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

// Create Cloudinary storage for general uploads
const createCloudinaryStorage = (folder = "kit_uploads") => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      resource_type: "auto"
    }
  });
};

// Create multer instance with Cloudinary storage
const createUploadMiddleware = (folder = "kit_uploads") => {
  const storage = createCloudinaryStorage(folder);
  return multer({ 
    storage: storage, 
    fileFilter: imageFilter 
  });
};

module.exports = {
  cloudinary,
  createCloudinaryStorage,
  createUploadMiddleware,
  imageFilter
};
