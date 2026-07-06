const Seller = require("../models/seller.model");

exports.applySeller = async (req,res)=>{

 const seller = await Seller.create({
   user:req.userId,
   shopName:req.body.shopName,
   businessEmail:req.body.businessEmail,
   phone:req.body.phone,
   address:req.body.address
 });

 res.status(201).json(seller);
};