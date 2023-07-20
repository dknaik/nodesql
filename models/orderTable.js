
module.exports = (sequelize,DataTypes)=>{
const orderTable = sequelize.define("ordertable",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER
    },
    order_date:{
        type:DataTypes.STRING
    },
    total_amount:{
        type:DataTypes.INTEGER
    }

},{
    tableName:"ordertable"
}) 
return orderTable
}