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