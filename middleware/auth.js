const jwt = require("jsonwebtoken")
let db = require("../models/index")
const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
app.use(cookieParser())
// Add your authentication middleware here
let User = db.user
const isAuthenticatedUser = async (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log("req.cookies.user", req.cookies.user)

  console.log("authHeader----->", authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not available" })
  }
  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Token not available" })
  }
  console.log("tokennn", token)
  try {
    const decodedData = jwt.verify(token, "dinesh")
    req.user = await User.findOne({
      where: { token: token }
    })
    console.log("req.userrrr", req.user)
    if (!req.user) {
      return res.status(401).json({ message: "Invalid token" })
    }
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

const isAdmin = async (req,res,next)=>{
  console.log("adminusercheck",req.user.role)
  if(req.user.role!=1){
     return res.status(403).json({message:"User cannot Acess this route"})
  }else{
    next()
  }
}

module.exports = { isAuthenticatedUser,isAdmin }
