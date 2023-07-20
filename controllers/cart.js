let db= require("../models/index")
const cartTable = db.cartTable;
const Product=db.products;
// const cartProduct=db.cartProducts;
const addProductToCart=async(req,res)=>{
    const { ProductId, ...cartData } = req.body;
   const existingCartItem = await cartTable.findOne({
    where:{
        user_id:cartData.user_id,
        // ProductId:ProductId
    },
    include:[
        {
            model:Product,
        }
    ]
   })
   if(!existingCartItem){
    const createCartItem=await cartTable.create({...req.body});
    res.status(200).json({data:createCartItem})
    //means there is no user exists with id sent in the table 
    // res.status(200).json({error:"Cart not found!"})
    return
   }
   if(existingCartItem){
    //if user exists
    const existingProduct = await cartTable.findOne({
        where:{
            user_id:cartData.user_id,
            ProductId:ProductId
        },
        include:[
            {
                model:Product,
            }
        ]
       })
       if(!existingProduct){
           const createCartItem=await cartTable.create({...req.body});
           res.status(200).json({data:createCartItem})
         return
       }else{
           existingProduct.quantity=1+ +existingProduct.quantity;
         await existingProduct.save()
       }
   }

// const existingCartItem=await cartTable.findOne({
//     where:{
//         user_id:cartData.user_id
//     },
//     include:[
//         {
//             model:Product,
//             through:{
//                 model:cartProduct
//             }
//         }
//     ]
// })

//    const data= await cartTable.create({...req.body});
// const productToAdd = await Product.findByPk(ProductId);
//    await cartTable.addProduct(product);
// await data.addProduct(productToAdd);

   res.status(200).json({data:existingCartItem})

}

const getCartProduct=async(req,res)=>{

     let data = await cartTable.findAll({
        where:{
            user_id:req.body.user_id
        },
        include:[
            {
                model:Product,
            }
        ]
     })
     res.status(200).json({data:data})
}  

const updateCart=async(req,res)=>{
    const {ProductId,...cartData}=req.body
    console.log("ProductIdddd---->",ProductId)
    const ifCart=await cartTable.findOne({where:{ProductId:ProductId,user_id:req.body.user_id}});
    // res.status(200).json({data:ifProduct})
    console.log("ifCarttt--->",ifCart)
    if(!ifCart){
        res.status(400).json({error:"Product does not exists"})
        return
    }
    const productToUpdate = await Product.findByPk(ProductId)
    if (!productToUpdate) {
        // Handle the case where the product with the given ProductId doesn't exist in the products table
        res.status(404).json({ error: "Product not found." });
        return;
      }
      //update product quantity
      const qtyUpdate = await cartTable.findOne({
        where:{
            ProductId:ProductId,
            user_id:req.body.user_id
        }
      })
      if(!qtyUpdate){
        res.status(400).json({error:"cart entry not found!"})
        return
      }
      qtyUpdate.quantity= req.body.quantity;
      await qtyUpdate.save();
     // await ifCart.setProduct(productToUpdate)
    // await ifCart.save();
    res.status(200).json({ data: qtyUpdate });

    // res.status(200).json({data:productToUpdate})
    // const productToUpdate=await
    // let data = await 
}

const deleteCart= async(req,res)=>{
    // req.params.id means --->cart id
    console.log("req.params.id---->",req.params.id)
    const cartEntryCheck=await cartTable.findOne({
        where:{
            id:req.params.id,
           
        },
        include:[
            {
                model:Product,
               
            }
        ]
    })
    if(!cartEntryCheck){
        res.status(400).json({error:'cart entry not found!'})
    }

    await cartTable.destroy({
        where:{
            id:req.params.id
        }
    })
    await cartEntryCheck.destroy();
    res.status(200).json({data:'cart Item successfully removed!'})


}
module.exports={
    addProductToCart,
    getCartProduct,
    updateCart,
    deleteCart
}

