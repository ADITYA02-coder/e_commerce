const controller = require("../controllers/seller.controller");
const authJwt = require("../middlewares/authJwt");

module.exports = function(app){

 app.post(
   "/api/seller/apply",
   [authJwt.verifyToken],
   controller.applySeller
 );

 app.get(
   "/api/seller/me",
   [authJwt.verifyToken],
   controller.getMySellerProfile
 );

};