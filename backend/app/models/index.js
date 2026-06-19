const dbConfig = require("../config/db.config.js");

console.log('db.config loaded, dbConfig.url:', dbConfig.url);

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require("./user.model");
db.role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];
db.cats = require("./cat.model.js")(mongoose);
db.customers = require("./customer.model.js")(mongoose);
db.products = require("./product.model.js"); 

db.profiles = require("./profile.model.js")(mongoose);
db.carts = require("./cart.model.js")(mongoose);
db.orders = require("./order.model.js")(mongoose);
db.addresses = require("./address.model.js")(mongoose);

// Ecommerce models
db.reviews = require("./review.model.js")(mongoose);
db.wishlists = require("./wishlist.model.js")(mongoose);
db.payments = require("./payment.model.js")(mongoose);

module.exports = db;
