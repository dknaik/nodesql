
module.exports = (sequelize,DataTypes)=>{
    const orderTable = sequelize.define("OrderTable",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        order_id:{
            type:DataTypes.INTEGER
        },
        product_id:{
            type:DataTypes.INTEGER
        },
        quantity:{
            type:DataTypes.INTEGER
        },
        price_per_unit:{
            type:DataTypes.INTEGER
        }
    
    }) 
    return orderTable
    }