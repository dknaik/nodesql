
module.exports = (sequelize,DataTypes)=>{
    const carttable = sequelize.define("carttable",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        user_id:{
            type:DataTypes.INTEGER
        },
        ProductId: {
            type: DataTypes.INTEGER,
          },
        quantity:{
            type:DataTypes.STRING
        }
    
    },{
        tableName:"carttable"
    }) 
    return carttable
    }