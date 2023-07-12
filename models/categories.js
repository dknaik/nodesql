

module.exports=(sequelize,DataTypes)=>{
  const categories =sequelize.define("Category",{
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
    parent_cat_id:{
        type:DataTypes.INTEGER
    }

  })
  return categories

}