const Seller = require("../models/seller.model");

module.exports = async (req,res,next)=>{

 const seller = await Seller.findOne({
   user:req.userId,
   isApproved:true
 });

 if(!seller){
   return res.status(403).json({
      message:"Seller approval required"
   });
 }

 req.seller = seller;

 next();
};