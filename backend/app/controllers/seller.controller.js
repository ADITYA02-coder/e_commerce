const Seller = require("../models/seller.model");
const db = require("../models");
const User = db.user;
const Role = db.role;

const uploadedFileUrl = (files, fieldName) => files?.[fieldName]?.[0]?.path || files?.[fieldName]?.[0]?.secure_url || files?.[fieldName]?.[0]?.url || "";

const sellerPayload = (body = {}, files = {}, existingSeller = null) => ({
  shopName: String(body.shopName || "").trim(),
  phone: String(body.phone || "").trim(),
  address: String(body.address || "").trim(),
  gstNumber: String(body.gstNumber || "").trim(),
  logo: uploadedFileUrl(files, "logoFile") || String(existingSeller?.logo || "").trim(),
  identityDocumentType: String(body.identityDocumentType || "passport").trim(),
  identityDocumentNumber: String(body.identityDocumentNumber || "").trim(),
  identityDocumentUrl: uploadedFileUrl(files, "identityDocumentFile") || String(existingSeller?.identityDocumentUrl || "").trim(),
  bankStatementUrl: uploadedFileUrl(files, "bankStatementFile") || String(existingSeller?.bankStatementUrl || "").trim(),
  liveSelfieUrl: uploadedFileUrl(files, "liveSelfieFile") || String(existingSeller?.liveSelfieUrl || "").trim(),
  authorizationLetterUrl: uploadedFileUrl(files, "authorizationLetterFile") || String(existingSeller?.authorizationLetterUrl || "").trim(),
  invoiceUrl: uploadedFileUrl(files, "invoiceFile") || String(existingSeller?.invoiceUrl || "").trim(),
  transparencyCode: String(body.transparencyCode || "").trim(),
  verificationStatus: "pending",
  verificationNotes: String(body.verificationNotes || existingSeller?.verificationNotes || "").trim(),
  verifiedAt: null,
  isApproved: false
});

const getUserRoles = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return [];
  }

  const roles = await Role.find({ _id: { $in: user.roles || [] } });
  return roles.map((role) => role.name);
};

exports.applySeller = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body.shopName || !String(req.body.shopName).trim()) {
      return res.status(400).json({ message: "shopName is required" });
    }

    const existingSeller = await Seller.findOne({ user: req.userId });
    const payload = sellerPayload(req.body, req.files || {}, existingSeller);

    const requiredFields = [
      "shopName",
      "phone",
      "address",
      "logo",
      "identityDocumentUrl",
      "bankStatementUrl",
      "liveSelfieUrl"
    ];

    const missingFields = requiredFields.filter((field) => !String(payload[field] || "").trim());
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required uploads: ${missingFields.join(", ")}`
      });
    }

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

exports.getAllSellers = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const roles = await getUserRoles(req.userId);
    if (!roles.includes("admin")) {
      return res.status(403).json({ message: "Admin role required" });
    }

    const sellers = await Seller.find().populate("user", "username email fullName roles").sort({ createdAt: -1 });
    return res.status(200).json(sellers);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch sellers" });
  }
};

exports.approveSeller = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const roles = await getUserRoles(req.userId);
    if (!roles.includes("admin")) {
      return res.status(403).json({ message: "Admin role required" });
    }

    const seller = await Seller.findByIdAndUpdate(
      req.params.sellerId,
      {
        $set: {
          isApproved: true,
          verificationStatus: "approved",
          verifiedAt: new Date(),
          verificationNotes: String(req.body.verificationNotes || "").trim()
        }
      },
      { new: true }
    ).populate("user", "username email fullName roles");

    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    return res.status(200).json(seller);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to approve seller" });
  }
};

exports.rejectSeller = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const roles = await getUserRoles(req.userId);
    if (!roles.includes("admin")) {
      return res.status(403).json({ message: "Admin role required" });
    }

    const rejectionReason = String(req.body.verificationNotes || req.body.rejectionReason || "").trim();

    const seller = await Seller.findByIdAndUpdate(
      req.params.sellerId,
      {
        $set: {
          isApproved: false,
          verificationStatus: "rejected",
          verifiedAt: null,
          verificationNotes: rejectionReason || "Seller application rejected by admin"
        }
      },
      { new: true }
    ).populate("user", "username email fullName roles");

    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    return res.status(200).json(seller);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to reject seller" });
  }
};