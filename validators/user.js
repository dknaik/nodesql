const Joi = require("joi")
const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  middleName: Joi.string().required(),
  lastName: Joi.string().required()
})
module.exports = {
  createUserSchema
}
