let db=require("../models/index");
let Products = db.products

const createProduct=async(req,res)=>{
    console.log("reqqq---->",req.body.catgoryId)
    //if there you get subcategory id then store it else store the category id only done.
    let data=await Products.create({...req.body,parent_cat_id:req.body.catgoryId})
     res.status(200).json({data:data})
}

const getallproducts=async(req,res)=>{
    let data = await Products.findAll({});
    res.status(200).json({data:data})
}
const updateProduct= async(req,res)=>{
    
    let data = await Products.update({...req.body,parent_cat_id:req.body.catgoryId},{where:{id:req.params.id}})
    res.status(200).json({data:data})
}

const deleteProduct = async(req,res)=>{
    const  data= await Products.destroy({
        where:{
            id:req.params.id
        }
    })
    res.status(200).json({data:data})
}

// const getAllProducts=async(req,res)=>{
//   const data =await .findAll
// }
module.exports={
    createProduct,
    getallproducts,
    updateProduct,
    deleteProduct
}
