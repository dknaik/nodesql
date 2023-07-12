
module.exports = (sequelize,DataTypes)=>{
const orderTable = sequelize.define("OrderTable",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    customer_id:{
        type:DataTypes.INTEGER
    },
    order_date:{
        type:DataTypes.STRING
    },
    total_amount:{
        type:DataTypes.INTEGER
    }

}) 
return orderTable
}