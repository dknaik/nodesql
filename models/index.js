const { Sequelize, DataTypes } = require("sequelize")

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("employeedb", "root", "Giriraj@1234", {
  host: "localhost",
  // logging:false, stops all the logs on terminal
  dialect: "mysql"
})
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
// db.contact = require("./contact")(sequelize, DataTypes)
db.user = require("./user")(sequelize, DataTypes)
//if you comment
// db.userContacts = require("./userContacts")(sequelize, DataTypes,db.user,db.contact)
db.categories = require("./categories")(sequelize,DataTypes);
db.products = require("./products")(sequelize,DataTypes);
db.productCategories = require("./product_categories")(sequelize,DataTypes,db.products,db.categories)
db.orderTable = require("./orderTable")(sequelize,DataTypes);
db.orderItems = require("./orderItems")(sequelize,DataTypes)
db.cartTable= require("./cart")(sequelize,DataTypes)
db.invoice=require("./invoice")(sequelize,DataTypes); 
// db.cartProducts = require("./cart_product")(sequelize,DataTypes,db.products,db.cartTable)

const dropTables = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    // Drop the userContacts table first
    // await db.userContacts.drop();
    // await db.categories.drop();
    // await db.orderTable.drop()
    // Drop the contact and user tables
    // await db.contact.drop();
    // await db.user.drop();
    // await db.products.drop();
    // await db.cartTable.drop();
    // await db.cartProducts.drop();
      //  await db.orderItems.drop();
      //  await db.orderTable.drop();
     await db.invoice.drop();

    console.log('Tables dropped successfully.');

    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// dropTables();




//one to one Association
// db.user.hasOne(db.contact);
// db.contact.belongsTo(db.user);
// db.categories.hasOne()
//one to Many
// db.user.hasMany(db.contact,{foreignKey:'user_id',as:'contactDetails'});
db.categories.hasMany(db.categories, {
  foreignKey: 'parent_cat_id',
  as: 'subCategories',
  onDelete: 'CASCADE',
});

//Many-to-Many
// db.user.belongsToMany(db.contact,{through:'user_contacts'});
//now created manually a model
// db.user.belongsToMany(db.contact,{through:db.userContacts});

// db.contact.belongsToMany(db.user,{through:'user_contacts'});
// db.contact.belongsToMany(db.user,{through:db.userContacts});
db.categories.hasMany(db.products,{foreignKey:'parent_cat_id'})

db.user.hasMany(db.cartTable,{foreignKey:'user_id',onDelete:'CASCADE'})
db.cartTable.belongsTo(db.user,{foreignKey:'user_id',onDelete:'CASCADE'})

db.products.hasMany(db.cartTable,{foreignKey:'ProductId',onDelete:'CASCADE'})
db.cartTable.belongsTo(db.products,{foreignKey:'ProductId',onDelete:'CASCADE'})

// db.cartTable.belongsToMany(db.products,{through:'cartproduct',foreignKey:'CartId',onDelete:'CASCADE'})
// db.products.belongsToMany(db.cartTable,{through:'cartproduct',foreignKey:'ProductId',onDelete:'CASCADE'})

db.orderTable.hasMany(db.orderItems,{foreignKey:'order_id',onDelete:'CASCADE'})
db.orderItems.belongsTo(db.orderTable,{foreignKey:'order_id',onDelete:'CASCADE'})
db.orderItems.belongsTo(db.products,{foreignKey: "product_id",onDelete:'CASCADE'});

//user and orderTable association
db.user.hasMany(db.orderTable,{foreignKey:'user_id',onDelete:'CASCADE'});
db.orderTable.belongsTo(db.user,{foreignKey:'user_id',onDelete:'CASCADE'})


//Invoice
db.invoice.belongsTo(db.orderTable,{foreignKey:'order_id',onDelete:"CASCADE"});
db.invoice.hasMany(db.orderItems,{foreignKey:'InvoiceId',onDelete:'CASCADE'});
db.orderItems.belongsTo(db.invoice,{foreignKey:'InvoiceId',onDelete:'CASCADE'});
db.orderTable.hasMany(db.invoice,{foreignKey:'order_id',onDelete:'CASCADE'})




db.sequelize = sequelize.sync({ force:false})
// db.Sequelize = sequelize.drop()
module.exports = db
