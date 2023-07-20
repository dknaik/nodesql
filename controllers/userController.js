const { createPaginationResponse } = require("../helpers/pagination")
const { generateToken } = require("../helpers/jwtToken")
const cookie = require("cookie")
let db = require("../models/index")

const jwt = require("jsonwebtoken")

const { Sequelize } = require("sequelize")
const bcrypt = require("bcryptjs")
const { createUserSchema } = require("../validators/user")
// console.log("dbuserrrr", db.user)
let User = db.user
let Contact =  db.contact
let UserContact = db.userContacts
let Categories = db.categories
let addUser = async (req, res) => {
  const jane = await User.create({ firstName: "Amitamama", lastName: "Shaha" })
  //   const jane = User.build({ firstName: "Jane", lastName: "singh" })
  await jane.update({ firstName: "Amita bhai", lastName: "meena" })
  console.log(jane instanceof User) // true
  console.log(jane.name) // "Jane"
  //   await jane.save()
  console.log("Jane was saved to the database!")
  console.log(jane.toJSON())
  res.status(200).json(jane.toJSON())
}
let getUsers = async (req, res) => {
  const { limit, offset } = req.query
  try {
    // const data = await User.findAll({})
    const { count, rows } = await User.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit)
    })
    const response = createPaginationResponse(limit, offset, count, rows)
    res.status(200).json({ data: response })
  } catch (error) {
    res.status(500).json({ error: "An error occured while fetching the data" })
  }
}
let getUsersById = async (req, res) => {
  const data = await User.findOne({ where: { id: req.params.id } })
  res.status(200).json({ data: data })
}
/////////////////////////////////////////////////////////create user
let createUser = async (req, res) => {
  console.log("creating user error")
  try {
    const { password, ...rest } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    postData = {
      ...req.body,
      password: hashedPassword,
      fullName: req.body.firstName + " " + req.body.lastName
    }
    //bulk create
    if (postData.length > 1) {
      var data = await User.bulkCreate(postData)
    } else {
      var data = await User.create(postData)
    }
    console.log("postData--->", data.id)
    const token = generateToken(data.id)
    await User.update({ token: token }, { where: { id: data.id } })
    // const data = await User.create(postData)
    console.log(data.toJSON())
    res.status(200).json({ data: data, token })
  } catch (error) {
    if(error.name==="SequelizeUniqueConstraintError" && error.fields.email){
      res.status(400).json({ error: "Email must be unique" });
    }else{
      res.status(500).json({ error: "An error occured" })
    }
  }
}

let login = async (req, res) => {
  const { email, password } = req.body
  console.log("userrrr", email, password)

  if (email && password) {
    console.log("emailll", email, password)
    const user = await User.findOne({ where: { email: email } })
    if (user) {
      req.user = user
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (passwordMatch) {
        const token = generateToken(user.id, res)
        user.token = token
        await user.save()
        const userCookie = cookie.serialize("user", JSON.stringify(user), {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 3600, // Set an appropriate expiration time for the cookie
          path: "/" // Adjust the path based on your application's needs
        })

        // Set the cookie in the response header
        res.setHeader("Set-Cookie", userCookie)
        res.status(200).json({ data: user, token })
      } else {
        res.status(200).json({ error: "Invalid credentials" })
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" })
    }
  } else {
    res.status(401).json({ error: "Missing email or Password" })
  }
}

let logout = async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not available" })
  }
  const token = authHeader.split(" ")[1]
  console.log("tokenlogout", token)
  try {
    if (token) {
      const decodedData = jwt.verify(token, "dinesh")
      await User.update({ token: null }, { where: { token: token } })
    }
    res.status(200).json({ message: "User logged out successfully" })
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

let deleteUser = async (req, res) => {
  console.log("delete user", req.params.id)
  const data = await User.destroy({
    where: {
      id: req.params.id
    }
  })
  res.status(200).json({ data })
}

let userPatch = async (req, res) => {
  const postData = req.body
  console.log("delete user", req.params.id)
  const data = await User.update(postData, {
    where: {
      id: req.params.id
    }
  })
  res.status(200).json({ data })
}
const getQueryData = async (req, res) => {
  console.log("delete user", req.params.id)
  try {
    const data = await User.findAll({
      attributes: [
        // "id",
        // ["firstName"],
        // "lastName",
        [Sequelize.fn("COUNT", Sequelize.col("firstName")), "count"]
      ],
      group: "firstName"
    })
    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: "Error occured" })
  }
}

const findersData = async (req, res) => {
  console.log("delete user", req.params.id)
  try {
    const data = await User.findAll({})
    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: "Error occured" })
  }
}

const oneToOneUser=async (req,res)=>{
//  const data =await  User.create({firstName:'Mahadev',lastName:"Naik",middleName:"S"})
//  if(data && data.id){
//    await Contact.create({permanent_address:'xyz',current_addres:'abc',user_id:data.id})
//  }
// let data= await User.findAll({
//   attributes:['firstName','lastName','id'],
//   include:[{
//     model:Contact,
//     as:'contactDetails',
//     attributes:['permanent_address','current_addres','user_id']
//   }],
//   where:{id:2}
// });
let data= await Contact.findAll({
  attributes:['permanent_address','current_addres','user_id'],
  include:[{
    model:User,
    as:'userDetails',
    attributes:['firstName','lastName','id']
  }],
  where:{id:2}

});

 res.status(200).json({data:data});
  
}
//here one user has one contact, which makes one to one

const oneToManyUser = async(req,res)=>{
  //  const data =await  User.create({firstName:'Mahadev',lastName:"Naik",middleName:"S"})
  //  const data =await Contact.create({permanent_address:'chennai',current_addres:'kundapur',user_id:2})
let data= await User.findAll({
  attributes:['firstName','lastName','id'],
  include:[{
    model:Contact,
    as:'contactDetails',
    attributes:['permanent_address','current_addres','user_id']
  }],
  // where:{id:2}
// });
// let data= await Contact.findAll({
//   attributes:['permanent_address','current_addres','user_id'],
//   include:[{
//     model:User,
//     as:'userDetails',
//     attributes:['firstName','lastName','id']
//   }],
  // where:{id:2}

});
  
  res.status(200).json({data:data});

}
const manyToManyUser = async(req,res)=>{
//  const data1= await User.create({firstName:'Arun',lastName:"Dinkar",middleName:"D"})
//  if(data1 && data1.id){
  //  await Contact.create({permanent_address:'Prahalad Nagar',current_addres:'Derasar m Road',user_id:data1.id})
//  }
 //now creating junction table manually but this will be dynamic when you use API
// const data1 =  await UserContact.create({UserId:1,ContactId:2})

//  let data1= await User.findAll({
//   attributes:['firstName','lastName','id'],
//   include:[{
//     model:Contact,
//     attributes:['permanent_address','current_addres','user_id'],
         
         
//      }],
//  })
  // const data =  await UserContact.findAll({})
// let data= await User.findAll({
  // attributes:['firstName','lastName','id'],
  // include:[{
    // model:Contact,
    // attributes:['permanent_address','current_addres','user_id']
  // }], 
  // where:{id:2}
// });
let data1= await Contact.findAll({
  attributes:['permanent_address','current_addres'],
  include:[{
    model:User,
    // as:'userDetails',
    attributes:['firstName','lastName']
  }],
  // where:{id:2}

});
  
  res.status(200).json({data:data1});

}

const paranoidUser=async(req,res)=>{
  // let data=await User.create({firstName:'sham',lastName:'Kumar','middleName':'ganesh'})
  //If date is stored then it's soft deleted and on fetching the data only those recored with null comes
  var data=await User.destroy({
   where:{
    id:2
   },
   //delete permenently
  //  force:true
  })
  // await User.restore();//To restore all
  await User.restore({where:{
    id:2
  }});

  // let data =  await User.findAll({})
  res.status(200).json({data:data})
}
// const createCategory= async(req,res)=>{
//   var data=await Categories.create({name:"Electronics",description:"abc",parent_cat_id:'1'})
//   res.status(200).json({data:data})
// }

module.exports = {
  addUser,
  getUsers,
  getUsersById,
  createUser,
  deleteUser,
  userPatch,
  getQueryData,
  findersData,
  login,
  logout,
  oneToOneUser,
  oneToManyUser,
  manyToManyUser,
  paranoidUser,
  // createCategory
}
