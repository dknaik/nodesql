const jwt = require("jsonwebtoken")
const generateToken = (userId) => {
  const secretKey = "dinesh" // Replace with your own secret key
  const expiresIn = "1h" // Token expiration time

  const payload = { userId }
  const options = { expiresIn }

  const token = jwt.sign(payload, secretKey, options)

  return token
}
module.exports = {
  generateToken
}
