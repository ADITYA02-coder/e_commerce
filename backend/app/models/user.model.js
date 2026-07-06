const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    fullName: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    bio: String,
    companyName: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  },
  {
    timestamps: true
  }
  )
);

module.exports = User;
