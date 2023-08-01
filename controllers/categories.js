let db= require("../models/index")
let Categories = db.categories
const { Sequelize ,Op} = require("sequelize");
let Products=db.products
const createCategory= async(req,res)=>{
  console.log("reqqqcreateCategory",req)
  const {parent_cat_id}=req.body;
  const parentCategoryId=parent_cat_id || null
    var data=await Categories.create({...req.body,parent_cat_id:parentCategoryId})
    res.status(200).json({data:data})
  }
  const createSubCategory=async(req,res)=>{
    var data=await Categories.create({...req.body,parent_cat_id:req.body.catgoryId})
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
  const updateSubCategory=async(req,res)=>{
    //you need can update the parent category for subcatgory also  
    const category= await Categories.findOne({
      where: {
        id: req.params.id,
        parent_cat_id: {
          [Op.not]: null,
        },
      },
    });  
     if (!category) {
    return res.status(400).json({ error: 'Cannot update subcategory with null parent_cat_id' });
  }
    let data=await Categories.update({...req.body,parent_cat_id:req.body.catgoryId},{where:{id:req.params.id}})
    res.status(200).json({data:data})
  }
  const updateCategory=async(req,res)=>{
    console.log("request",req.params.id)
    const category=await Categories.findOne({
      where:{
        id:req.params.id,
        parent_cat_id:null
      }
    })
    if(!category){
      return res.status(400).json({error:"Cannot update category with non null parent_cat_id"})
    }
    

    let data=await Categories.update({...req.body},{where:{id:req.params.id,parent_cat_id:null}})
    res.status(200).json({data:data})
  }
  const getCategory=async(req,res)=>{
    let data=await Categories.findAll({
      attributes:['id','name','description','parent_cat_id'],
      include:[{
        model:Categories,
        as:'subCategories',
        attributes:['id','name','description','parent_cat_id'],
        include:[
          {
            model:Products
          }
        ]
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
    onlyGetSubCategoriesByCatId,
    updateSubCategory
  }