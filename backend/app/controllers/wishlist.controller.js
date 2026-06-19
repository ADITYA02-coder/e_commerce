const db = require("../models");
const Wishlist = db.wishlists;

// Get user's wishlist
exports.getWishlist = (req, res) => {
  Wishlist.findOne({ userId: req.userId })
    .populate({
      path: "items.productId",
      select: "name brand price image primaryImage rating stock"
    })
    .then(data => {
      if (!data) {
        return res.send({ items: [] });
      }
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving wishlist"
      });
    });
};

// Add to wishlist
exports.addToWishlist = (req, res) => {
  const productId = req.body.productId;

  Wishlist.findOne({ userId: req.userId })
    .then(wishlist => {
      if (!wishlist) {
        // Create new wishlist
        const newWishlist = new Wishlist({
          userId: req.userId,
          items: [{ productId: productId }]
        });
        return newWishlist.save();
      }

      // Check if product already in wishlist
      const exists = wishlist.items.some(item => item.productId.toString() === productId);
      if (exists) {
        return res.status(400).send({ message: "Product already in wishlist" });
      }

      wishlist.items.push({ productId: productId });
      return wishlist.save();
    })
    .then(data => {
      res.send({ message: "Added to wishlist", data });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error adding to wishlist"
      });
    });
};

// Remove from wishlist
exports.removeFromWishlist = (req, res) => {
  const productId = req.body.productId;

  Wishlist.findOneAndUpdate(
    { userId: req.userId },
    { $pull: { items: { productId: productId } } }
  )
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "Wishlist not found" });
      }
      res.send({ message: "Removed from wishlist" });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error removing from wishlist"
      });
    });
};

// Clear wishlist
exports.clearWishlist = (req, res) => {
  Wishlist.findOneAndUpdate(
    { userId: req.userId },
    { items: [] }
  )
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "Wishlist not found" });
      }
      res.send({ message: "Wishlist cleared" });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error clearing wishlist"
      });
    });
};
