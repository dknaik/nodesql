
module.exports=(sequelize,DataTypes)=>{
    const Invoice = sequelize.define('invoice', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        invoiceNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        invoiceDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        dueDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      
        
        // subtotal: {
        //   type: DataTypes.FLOAT,
        //   allowNull: false,
        // },
        // tax: {
        //   type: DataTypes.FLOAT,
        //   allowNull: true,
        // },
        // discount: {
        //   type: DataTypes.FLOAT,
        //   allowNull: true,
        // },
        totalAmount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        order_id:{
          type:DataTypes.INTEGER,
          allowNull:false
        },
      },{
        tableName:"invoice"
      });
return Invoice
}


