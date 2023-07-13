// const { DataTypes } = require("sequelize")
// const sequelize = require("./index")
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING
        // allowNull: false
      },
      middleName: {
        type: DataTypes.STRING
        // allowNull defaults to true
      },
      lastName: {
        type: DataTypes.STRING
        // allowNull defaults to true
      },
      fullName: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      // username: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   unique: true
      // },
      // password: {
      //   type: DataTypes.STRING,
      //   allowNull: true
      // },
      // role: {
      //   type: DataTypes.STRING,
      //   allowNull: true
      // },
      // token: {
      //   type: DataTypes.STRING
      // }
    },
    {
      sequelize,
      // modelName: "User"
      // Other model options go here
      tableName: "users",
      paranoid:true,
      deletedAt:'soft_delete'

    }
  )
  return User
}

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User) // true
// module.exports = User
