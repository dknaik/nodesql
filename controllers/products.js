let db=require("../models/index");
let Products = db.products

const createProduct=async(req,res)=>{
    let data=await Products.create({name:"Lenovo",description:"xyz",price:"100",quantity_available:'2'})
     res.status(200).json({data:data})
}
module.exports={
    createProduct
}