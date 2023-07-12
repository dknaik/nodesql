// const { DataTypes } = require("sequelize")
// const sequelize = require("./index")
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "Contact",
    {
      // Model attributes are defined here
      permanent_address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      current_addres: {
        type: DataTypes.STRING
        // allowNull defaults to true
      },
      // user_id:DataTypes.INTEGER
    },
    {
      // sequelize
      // modelName: "User"
      // Other model options go here
      tableName: "Contact"
    }
  )
  return Contact
}

// `sequelize.define` also returns the model
// console.log(Contact === sequelize.models.Contact) // true
// module.exports = Contact
