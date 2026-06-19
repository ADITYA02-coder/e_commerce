const db = require("../models");
const Product = db.products;
const fs = require("fs");
  //http://localhost:8090/uploads/7acef58e-da7a-4986-803e-6e717de80577.jpg
  global.__basedir = __dirname;
// Create and Save a new Product
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.name) {
//     res.status(400).send({ message: "Product Name can not be empty!" });
//     return;
//   }

//   // Create a Product
//   const product = new Product({
//     name: req.body.name,
//     category: req.body.category,
//     price: req.body.price,
//     brand: req.body.brand,
//     ram: req.body.ram,
//     rom: req.body.rom,
//     screenSize: req.body.screenSize,
//     camera: req.body.camera,
//     image: req.body.image,
//     active: req.body.active ? req.body.active : false
//   });

//   // Save Product in the database
//   product
//     .save(product)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Product."
//       });
//     });
// };
//


// Create and Save a new User
exports.create = async (req, res) => {
  console.log("Hello Aman");

  try {
    console.log(req.file);

    const imageUrl = req.file?.path || req.body.image || "";

    const data = await Product.create({
      userId: req.body.userId,
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      brand: req.body.brand,
      ram: req.body.ram,
      rom: req.body.rom,
      screenSize: req.body.screenSize,
      camera: req.body.camera,
      battery: req.body.battery,
      processor: req.body.processor,
      color: req.body.color,
      rating: req.body.rating,
      stock: req.body.stock,
      quantity: req.body.quantity,
      availability: req.body.availability,
      active: req.body.active ? req.body.active : false,
      image: imageUrl,
      primaryImage: imageUrl,
      images: imageUrl ? [imageUrl] : [],
    });

    console.log(data);
    return res.status(201).send(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error when trying to upload image: ${error}`);
  }
};

// Retrieve all products from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Product.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Courses."
      });
    });
};

// Find a single Product with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Product.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Product with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Product with id=" + id });
    });
};

// Update a Product by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Product.findByIdAndUpdate(id, req.body)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Product with id=${id}. Maybe Product was not found!`
        });
      } else res.send({ message: "Product was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Product with id=" + id
      });
    });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Product.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      } else {
        res.send({
          message: "Product was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id
      });
    });
};

// Delete all Product from the database.
exports.deleteAll = (req, res) => {
  Product.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Products were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Products."
      });
    });
};

// Find all published Products
exports.findAllActive = (req, res) => {
  Product.find({ active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Products."
      });
    });
};

// Search and filter phones by specifications
exports.filterBySpecs = (req, res) => {
  try {
    const filters = {};

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = parseInt(req.query.maxPrice);
    }

    // Brand
    if (req.query.brand) {
      filters.brand = { $in: req.query.brand.split(",") };
    }

    // RAM
    if (req.query.minRam || req.query.maxRam) {
      filters.ram = {};
      if (req.query.minRam) filters.ram.$gte = parseInt(req.query.minRam);
      if (req.query.maxRam) filters.ram.$lte = parseInt(req.query.maxRam);
    }

    // ROM
    if (req.query.minRom || req.query.maxRom) {
      filters.rom = {};
      if (req.query.minRom) filters.rom.$gte = parseInt(req.query.minRom);
      if (req.query.maxRom) filters.rom.$lte = parseInt(req.query.maxRom);
    }

    // Color
    if (req.query.color) {
      filters.color = { $in: req.query.color.split(",") };
    }

    // Processor
    if (req.query.processor) {
      filters.processor = new RegExp(req.query.processor, "i");
    }

    // Rating (minimum rating)
    if (req.query.minRating) {
      filters.rating = { $gte: parseFloat(req.query.minRating) };
    }

    // Stock availability
    if (req.query.inStock === "true") {
      filters.stock = { $gt: 0 };
      filters.availability = true;
    }

    // Featured products
    if (req.query.featured === "true") {
      filters.isFeatured = true;
    }

    // Only active products
    filters.active = true;

    // Sort options
    const sortOptions = {};
    if (req.query.sortBy === "price_asc") sortOptions.price = 1;
    if (req.query.sortBy === "price_desc") sortOptions.price = -1;
    if (req.query.sortBy === "rating") sortOptions.rating = -1;
    if (req.query.sortBy === "newest") sortOptions.createdAt = -1;

    Product.find(filters)
      .sort(sortOptions)
      .limit(req.query.limit ? parseInt(req.query.limit) : 0)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Error filtering products"
        });
      });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error processing filter request"
    });
  }
};

// Get products by brand
exports.findByBrand = (req, res) => {
  Product.find({ brand: req.params.brand, active: true })
    .sort({ createdAt: -1 })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving products"
      });
    });
};

// Get featured products
exports.getFeatured = (req, res) => {
  Product.find({ isFeatured: true, active: true })
    .limit(10)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving featured products"
      });
    });
};

// Get best-selling products (by rating and review count)
exports.getBestSelling = (req, res) => {
  Product.find({ active: true })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(req.query.limit ? parseInt(req.query.limit) : 10)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving best-selling products"
      });
    });
};

// Update product stock
exports.updateStock = (req, res) => {
  const id = req.params.id;
  const quantity = req.body.quantity;

  Product.findByIdAndUpdate(
    id,
    { 
      stock: quantity,
      availability: quantity > 0
    }
  )
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Product not found" });
      } else {
        res.send({ message: "Stock updated successfully" });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error updating stock"
      });
    });
};
