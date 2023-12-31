
module.exports = (sequelize,DataTypes)=>{
    const orderItems = sequelize.define("orderitem",{
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
        },
        InvoiceId:{
             type:DataTypes.INTEGER,
             allowNull: true,

        }
    
    },{
        tableName:"orderitem"
    }) 
    return orderItems
    }