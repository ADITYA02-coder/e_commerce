const controller = require("../controllers/seller.controller");

module.exports = function(app){

 app.post(
   "/api/seller/apply",
   controller.applySeller
 );

};