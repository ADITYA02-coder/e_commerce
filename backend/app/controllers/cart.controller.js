const db = require("../models");
const Cart = db.carts;
const mongoose = require("mongoose");
// const Product = require("../models/product.model");
// Create or update Cart (add items)
exports.create = async (req, res) => {
  const { items } = req.body;
  const userId = req.userId;

  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).send({ message: "Missing required fields." });
  }

  const invalidItem = items.find(
    ({ productId, quantity, price }) =>
      !mongoose.Types.ObjectId.isValid(productId) ||
      !Number.isFinite(Number(quantity)) ||
      Number(quantity) <= 0 ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
  );

  if (invalidItem) {
    return res.status(400).send({ message: "Missing required item fields." });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items, active: true });
    } else {
      items.forEach(({ productId, quantity, price }) => {
        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === String(productId)
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += Number(quantity);
        } else {
          cart.items.push({ productId, quantity, price });
        }
      });
    }

    const savedCart = await cart.save();
    res.send(savedCart);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error creating/updating cart."
    });
  }
};

// Retrieve all carts
exports.findAll = (req, res) => {
  Cart.find()
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving carts."
      });
    });
};

// Find a single cart by ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Cart.findById(id);
    if (!data) return res.status(404).send({ message: `Cart not found with id=${id}` });
    if (String(data.userId) !== String(req.userId)) {
      return res.status(403).send({ message: "You can only access your own cart" });
    }
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: "Error retrieving cart with id=" + id });
  }
};


// Find a cart by userId with populated product details
// const mongoose = require("mongoose");
const Product = require("../models/product.model"); // adjust path as needed

exports.findByUserId = async (req, res) => {
  const userId = req.params.userId;

  if (String(userId) !== String(req.userId)) {
    return res.status(403).send({ message: "You can only access your own cart" });
  }

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: "Invalid userId format" });
  }

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find cart by userId
    const cart = await Cart.findOne({ userId: userObjectId }).lean();

    if (!cart) {
      return res.status(404).send({ message: `Cart not found for userId=${userId}` });
    }

    // For each item, fetch product details and attach
    const updatedItems = await Promise.all(
  cart.items.map(async (item) => {
    let productDetails = null;
    try {
      // Convert productId string to ObjectId
      const productObjectId = new mongoose.Types.ObjectId(item.productId);
      productDetails = await Product.findById(productObjectId).lean();
    } catch (err) {
      console.error(`Error fetching product ${item.productId}:`, err);
    }

    return {
      ...item,
      productDetails,
    };
  })
);

    // Return cart with populated productDetails
    res.send({
      ...cart,
      items: updatedItems,
    });
  } catch (err) {
    console.error("Error retrieving cart:", err);
    res.status(500).send({ message: "Error retrieving cart for userId=" + userId });
  }
};

// Update a cart
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).send({ message: `Cannot update cart with id=${id}. Not found!` });
    }
    if (String(cart.userId) !== String(req.userId)) {
      return res.status(403).send({ message: "You can only update your own cart" });
    }
    const data = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: "Error updating cart with id=" + id });
  }
};

// Delete a cart
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).send({ message: `Cannot delete cart with id=${id}. Not found!` });
    }
    if (String(cart.userId) !== String(req.userId)) {
      return res.status(403).send({ message: "You can only delete your own cart" });
    }
    await Cart.findByIdAndDelete(id);
    return res.send({ message: "Cart was deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: "Could not delete cart with id=" + id });
  }
};

// Delete all carts
exports.deleteAll = (req, res) => {
  Cart.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} carts deleted.` });
    })
    .catch(err => {
      res.status(500).send({ message: "Error deleting all carts." });
    });
};

// Find all active carts
exports.findAllActive = (req, res) => {
  Cart.find({ active: true })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({ message: "Error retrieving active carts." });
    });
};
