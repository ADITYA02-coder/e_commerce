const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sku: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    description: { type: String },
    category: String,
    brand: String,
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Discount percentage
    discountedPrice: Number,
    
    // Phone Specifications
    ram: Number, // in GB
    rom: Number, // in GB
    screenSize: String, // e.g., "6.5 inches"
    camera: String, // e.g., "48MP + 12MP"
    battery: String, // in mAh
    processor: String,
    color: String,
    storage: [String], // Multiple storage variants
    
    // Ecommerce fields
    images: [String], // Array of image URLs
    primaryImage: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    
    // Inventory
    stock: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    availability: { type: Boolean, default: true },
    
    // Product Details
    warranty: { type: String, default: "1 year" },
    returnPolicy: { type: Number, default: 30 }, // days
    shippingDays: { type: Number, default: 3 },
    
    // Status
    active: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Product = mongoose.model("Product", schema);

module.exports = Product;
