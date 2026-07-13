const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    shopName: {
      type: String,
      required: true
    },

    phone: String,

    address: String,

    gstNumber: String,

    logo: String,

    identityDocumentType: {
      type: String,
      enum: ["passport", "driver_license"],
      default: "passport"
    },

    identityDocumentNumber: String,

    identityDocumentUrl: String,

    bankStatementUrl: String,

    liveSelfieUrl: String,

    authorizationLetterUrl: String,

    invoiceUrl: String,

    transparencyCode: String,

    verificationStatus: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending"
    },

    verificationNotes: String,

    verifiedAt: Date,

    isApproved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports =
mongoose.model("Seller", sellerSchema);