const db = require("../models");

const Seller = db.seller;

module.exports = async (req,res,next)=>{

 try {

   const seller = await Seller.findOne({
      user:req.userId,
      isApproved:true
   });

   if(!seller){
      return res.status(403).json({
         success:false,
         message:"Seller approval required"
      });
   }

   req.seller = seller;

   next();

 } catch(err){
   res.status(500).json({
      message:err.message
   });
 }

};