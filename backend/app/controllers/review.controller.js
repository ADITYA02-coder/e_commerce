const db = require("../models");
const Review = db.reviews;

// Create a review
exports.create = (req, res) => {
  const review = new Review({
    userId: req.userId,
    productId: req.body.productId,
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    verified: req.body.verified || false
  });

  review.save()
    .then(data => {
      // Update product rating
      updateProductRating(req.body.productId);
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error creating review"
      });
    });
};

// Get all reviews for a product
exports.findByProduct = (req, res) => {
  Review.find({ productId: req.params.productId })
    .populate("userId", "username email")
    .sort({ createdAt: -1 })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving reviews"
      });
    });
};

// Get user's reviews
exports.findByUser = (req, res) => {
  Review.find({ userId: req.userId })
    .populate("productId", "name brand")
    .sort({ createdAt: -1 })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving reviews"
      });
    });
};

// Update a review
exports.update = (req, res) => {
  Review.findByIdAndUpdate(
    req.params.id,
    req.body
  )
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "Review not found" });
      }
      // Update product rating
      updateProductRating(data.productId);
      res.send({ message: "Review updated successfully" });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error updating review"
      });
    });
};

// Delete a review
exports.delete = (req, res) => {
  Review.findByIdAndDelete(req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "Review not found" });
      }
      // Update product rating
      updateProductRating(data.productId);
      res.send({ message: "Review deleted successfully" });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error deleting review"
      });
    });
};

// Helper: Update product average rating
function updateProductRating(productId) {
  Review.aggregate([
    { $match: { productId: new db.mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }
  ])
    .then(result => {
      const avgRating = result.length > 0 ? result[0].avg : 0;
      const reviewCount = result.length > 0 ? result[0].count : 0;
      
      db.products.findByIdAndUpdate(
        productId,
        { rating: avgRating, reviewCount: reviewCount }
      ).catch(err => console.log("Error updating product rating:", err));
    })
    .catch(err => console.log("Error aggregating reviews:", err));
}
