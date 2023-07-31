module.exports = (sequelize,DataTypes)=>{
    const Product = sequelize.define("Products",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
      name:{
        type:DataTypes.STRING
      },
      description:{
        type:DataTypes.STRING
      },
      price:{
        type:DataTypes.INTEGER
      },
      quantity_available:{
        type:DataTypes.INTEGER
      },
    
    },{
        tableName:"products"
      })
      return Product
}
//need to add catgeory id ion Products then only can get list of products in perticular categroy or sub category