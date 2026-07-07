const Seller = require("../models/seller.model");

exports.applySeller = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body.shopName || !String(req.body.shopName).trim()) {
      return res.status(400).json({ message: "shopName is required" });
    }

    const payload = {
      shopName: String(req.body.shopName || "").trim(),
      phone: req.body.phone || "",
      address: req.body.address || "",
      gstNumber: req.body.gstNumber || "",
      logo: req.body.logo || ""
    };

    const seller = await Seller.findOneAndUpdate(
      { user: req.userId },
      { $set: payload, $setOnInsert: { user: req.userId } },
      { new: true, upsert: true }
    );

    return res.status(200).json(seller);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to save seller profile" });
  }
};

exports.getMySellerProfile = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const seller = await Seller.findOne({ user: req.userId });
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    return res.status(200).json(seller);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch seller profile" });
  }
};