let db= require("../models/index")
let Categories = db.categories
const { Sequelize } = require("sequelize");
let Products=db.products
const createCategory= async(req,res)=>{
  const {parent_cat_id}=req.body;
  const parentCategoryId=parent_cat_id || null
    var data=await Categories.create({name:"Furniture",description:"Furniture",parent_cat_id:parentCategoryId})
    res.status(200).json({data:data})
  }
  const createSubCategory=async(req,res)=>{
    var data=await Categories.create({name:'TV & Radio',description:"Description for TV & Radio",parent_cat_id:1})
    res.status(200).json({data:data})
  }

  const onlyGetCategories=async(req,res)=>{
    var data=await Categories.findAll({where:{parent_cat_id:null}})
    res.status(200).json({data:data})
  }
  const onlyGetSubCategoriesByCatId=async(req,res)=>{ 
    //you have to get parent Category Id here
    console.log("parentcatid",req.params.id)
  let data=await Categories.findAll({where:{parent_cat_id:req.params.id}})
  res.status(200).json({data:data})
  }
  const updateCategory=async(req,res)=>{
    console.log("request",req.params.id)

    var data=await Categories.update({description:"clothes description"},{where:{id:req.params.id}})
    res.status(200).json({data:data})
  }
  const getCategory=async(req,res)=>{
    let data=await Categories.findAll({
      attributes:['id','name','description','parent_cat_id'],
      include:[{
        model:Categories,
        as:'subCategories',
        attributes:['id','name','description','parent_cat_id']
      },{
        model:Products
      }],
      where: {
        parent_cat_id: null, // Fetch only main categories with parent_cat_id as null
      },
      // where: {
      //   parent_cat_id: {
      //     [Sequelize.Op.not]: null, // Fetch only categories with a parent_cat_id
      //   },
      // },
    
    })
    res.status(200).json({data:data})
  }
  const deleteCategory=async(req,res)=>{
    // let data = await Categories.findByPk(req.params.id)
    let data=await Categories.destroy({
      where:{
        id:req.params.id
      }
    })
    res.status(200).json({data:data})
  }

  module.exports={
    createCategory,
    updateCategory,
    getCategory,
    deleteCategory,
    createSubCategory,
    onlyGetCategories,
    onlyGetSubCategoriesByCatId
  }