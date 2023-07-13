
module.exports = (sequelize,DataTypes,Products,Category)=>{
    const productCategories = sequelize.define('productCategories',{
        ProductId:{
            type:DataTypes.INTEGER,
            reference:{
                model:Category,
                key:'id'

            }
        },
        CategoryId:{
            type:DataTypes.INTEGER,
            reference:{
                model:Products,
                key:'id'
            }
        },
    },{
        timestamps:false
    },{
        tableName:"productCategories"
    })
    return productCategories
}