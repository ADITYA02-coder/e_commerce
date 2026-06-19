require("dotenv").config({ path: require('path').join(__dirname, '.env') });
console.log('Loaded .env from', require('path').join(__dirname, '.env'));
console.log('process.env.MONGODB_URI:', process.env.MONGODB_URI);
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const app = express();

process.on('uncaughtException', err => {
  console.error('Uncaught exception:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "kit_uploads",
    resource_type: "auto"
  }
});

const upload = multer({ storage: storage });

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:3000,http://localhost:5174")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  }
};

app.use(cors(corsOptions));
/* for Angular Client (withCredentials) */
// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:8081"],
//   })
// );


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "kit-session",
    keys: [process.env.COOKIE_SECRET || "change-this-cookie-secret"],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
  })
);

const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");
const hasFrontendBuild = fs.existsSync(path.join(frontendDistPath, "index.html"));

const db = require("./app/models");
const Role = db.role;
console.log('Loaded models, DB URL present:', !!db.url);
console.log('db.url (models):', db.url);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));
}

// simple route
app.get("/", (req, res) => {
  if (hasFrontendBuild) {
    return res.sendFile(path.join(frontendDistPath, "index.html"));
  }

  res.json({ message: "Welcome to backend application." });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Function to serve all static files inside public directory.
app.use(express.static('public'));

// File upload endpoint (saves to Cloudinary)
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    
    const ename = req.body.ename;
    const qname = req.body.qname;

    console.log('Title:', ename);
    console.log('Title:', qname);
    console.log('File URL:', req.file.path);

    // Return Cloudinary URL
    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: req.file.path,
      fileId: req.file.filename
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).send('Server error');
  }
});
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/cat.routes")(app);
require("./app/routes/customer.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/profile.routes")(app);
require("./app/routes/cart.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/address.routes")(app);

// Ecommerce routes
require("./app/routes/review.routes")(app);
require("./app/routes/wishlist.routes")(app);
require("./app/routes/payment.routes")(app);

if (hasFrontendBuild) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// set port, listen for requests
const PORT = process.env.PORT || 8090;

db.mongoose
  .connect(db.url)
  .then(() => {
    console.log("Connected to the database!");
    initial();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });

    server.on("error", err => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the other server or set a different PORT.`);
      } else {
        console.error("Server failed to start:", err);
      }
      process.exit(1);
    });
  })
  .catch(err => {
    console.error("Cannot connect to the database using primary URI.");
    console.error(`Primary MONGODB_URI: ${db.url.replace(/\/\/.*@/, "//<credentials>@")}`);
    console.error(err && err.message ? err.message : err);

    const fallback = process.env.MONGODB_FALLBACK_URI || "mongodb://localhost:27017/kitdb";
    if (fallback && fallback !== db.url) {
      console.log("Attempting fallback MongoDB URI:", fallback);
      db.mongoose
        .connect(fallback)
        .then(() => {
          console.log("Connected to fallback database!");
          initial();

          const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
          });

          server.on("error", err => {
            if (err.code === "EADDRINUSE") {
              console.error(`Port ${PORT} is already in use. Stop the other server or set a different PORT.`);
            } else {
              console.error("Server failed to start:", err);
            }
            process.exit(1);
          });
        })
        .catch(fbErr => {
          console.error("Fallback DB connection failed.");
          console.error(`Fallback MONGODB_URI: ${fallback.replace(/\/\/.*@/, "//<credentials>@")}`);
          console.error(fbErr && fbErr.message ? fbErr.message : fbErr);
          console.error("If you're using MongoDB Atlas, whitelist your IP or run a local MongoDB instance.");
          process.exit(1);
        });
    } else {
      console.error("No fallback DB URI available. Please provide a local MongoDB or update MONGODB_URI.");
      process.exit(1);
    }
  });

function initial() {
  Role.estimatedDocumentCount()
    .then(count => {
      if (count !== 0) {
        return;
      }

      return Role.insertMany([
        { name: "user" },
        { name: "moderator" },
        { name: "admin" }
      ]).then(() => {
        console.log("added roles to roles collection");
      });
    })
    .catch(err => {
      console.log("error", err);
    });
}

