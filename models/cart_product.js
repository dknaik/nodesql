
module.exports = (sequelize,DataTypes,Products,CartTable)=>{
    const productCategories = sequelize.define('cartproduct',{
        ProductId:{
            type:DataTypes.INTEGER,
            references:{
                model:Products,
                key:'id'

            }
        },
        CartId:{
            type:DataTypes.INTEGER,
            references:{
                model:CartTable,
                key:'id'
            }
        },
    },{
        timestamps:false
    },{
        tableName:"cartproduct"
    })
    return productCategories
}