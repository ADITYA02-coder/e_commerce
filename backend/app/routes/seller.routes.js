const controller = require("../controllers/seller.controller");
const authJwt = require("../middlewares/authJwt");

module.exports = function(app){
 const { createDocumentUploadMiddleware } = require("../config/upload.config.js");
 const uploadSellerFiles = createDocumentUploadMiddleware("seller_uploads");

 app.post(
   "/api/seller/apply",
   [authJwt.verifyToken],
   uploadSellerFiles.fields([
     { name: "logoFile", maxCount: 1 },
     { name: "identityDocumentFile", maxCount: 1 },
     { name: "bankStatementFile", maxCount: 1 },
     { name: "liveSelfieFile", maxCount: 1 },
     { name: "authorizationLetterFile", maxCount: 1 },
     { name: "invoiceFile", maxCount: 1 }
   ]),
   controller.applySeller
 );

 app.get(
   "/api/seller/me",
   [authJwt.verifyToken],
   controller.getMySellerProfile
 );

 app.get(
   "/api/seller/admin/all",
   [authJwt.verifyToken, authJwt.isAdmin],
   controller.getAllSellers
 );

 app.patch(
   "/api/seller/admin/:sellerId/approve",
   [authJwt.verifyToken, authJwt.isAdmin],
   controller.approveSeller
 );

 app.patch(
   "/api/seller/admin/:sellerId/reject",
   [authJwt.verifyToken, authJwt.isAdmin],
   controller.rejectSeller
 );

};