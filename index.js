const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
// const User = require("./models/user")
// const Contact = require("./models/contact")
// const schema = Joi.object().keys({
//   firstName: Joi.string().required(),
//   middleName: Joi.string().required(),
//   lastName: Joi.string().required()
//  search:Joi.string().optional().valid("car","bike","truck")
//amount:Joi.number().integer().main(1).max(20)
//age:Joi.number().when('name',{is:'test',then:Joi.required(),otherwise:Joi.optional()})
// item:Joi.object().keys({
//   id:Joi.number().required(),
//   name:Joi.string().required()
// })
// }).unknown(false)
require("./models/index")
let userCtrl = require("./controllers/userController")
const Joi = require("joi")
const { isAuthenticatedUser } = require("./middleware/auth")
// const sequelize = require("./models")
// require("./models/index")
app.use(bodyParser.json())
app.use(cookieParser())
app.get("/", function (req, res) {
  res.send("hello")
})
app.get("/add", userCtrl.addUser)

app.get("/users/:id", userCtrl.getUsersById)
const validationMiddleWare = (req, res, next) => {
  console.log("reqqqqq", req.body)
  const schema = Joi.object().keys({
    firstName: Joi.string()

      .required()
      .messages({
        "any.required": "first name is required",
        "string.empty": "First name is required"
      })
      .pattern(/^[A-Za-z]+$/, { invert: false })
      .messages({
        "string.pattern.base": "First name should only contain alphabets"
      }),
    middleName: Joi.string()
      .required()
      .messages({
        "any.required": "middle name is required",
        "string.empty": "middle name is required"
      })
      .pattern(/^[A-Za-z]+$/, { invert: false })
      .messages({
        "string.pattern.base": "Middle name should only contain alphabets"
      }),
    lastName: Joi.string().required().messages({
      "any.required": "last name is required"
    }),
    username: Joi.string().required().messages({
      "any.required": "username is required"
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required"
    }),
    role: Joi.string().required().messages({
      "any.required": "role is required"
    }),
    email: Joi.string().required().messages({
      "any.required": "Email is required"
    })
  })
  const { error } = schema.validate(req.body, { abortEarly: false })
  // console.log("ressss->", response)
  if (error) {
    const errorDetails = error.details.reduce((acc, curr) => {
      acc[curr.context.key] = curr.message
      return acc
    }, {})
    res.status(201).json({ data: {}, message: errorDetails })
  } else {
    next()
  }
}
const validationMiddleWareLogin = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().required().messages({
      "any.required": "Please Enter Email"
    }),
    password: Joi.string().required().messages({
      "any.required": "Please Enter Pasword"
    })
  })
  const { error } = schema.validate(req.body, { abortEarly: false })
  // console.log("ressss->", response)
  if (error) {
    const errorDetails = error.details.reduce((acc, curr) => {
      acc[curr.context.key] = curr.message
      return acc
    }, {})
    res.status(201).json({ data: {}, message: errorDetails })
  } else {
    next()
  }
}
app.post("/users", userCtrl.createUser)
app.get("/users", userCtrl.getUsers)
// app.post("/login", validationMiddleWareLogin, userCtrl.login)
// app.get("/users", isAuthenticatedUser, userCtrl.getUsers)

// app.post("/logout", userCtrl.logout)
app.delete("/users/:id", userCtrl.deleteUser)
app.patch("/users/:id", userCtrl.userPatch)
app.get("/queryusers", userCtrl.getQueryData)
app.get("/finders", userCtrl.findersData)
app.get('/one-to-one',userCtrl.oneToOneUser)
app.get('/one-to-many',userCtrl.oneToManyUser);
app.get('/many-to-many',userCtrl.manyToManyUser);


// User.sync({ force: true })
// Contact.sync({ force: true })
//No  need to write again and again
//sync from  Sequilize
app.listen(3010, () => {
  console.log("App is running on: http://localhost:3010")
})
