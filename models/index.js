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
db.contact = require("./contact")(sequelize, DataTypes)
db.user = require("./user")(sequelize, DataTypes)
//if you comment
db.userContacts = require("./userContacts")(sequelize, DataTypes,db.user,db.contact)
db.categories = require("./categories")(sequelize,DataTypes);
db.products = require("./products")(sequelize,DataTypes);
db.orderTable = require("./orderTable")(sequelize,DataTypes);

const dropTables = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    // Drop the userContacts table first
    await db.userContacts.drop();

    // Drop the contact and user tables
    await db.contact.drop();
    await db.user.drop();

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

//one to Many
// db.user.hasMany(db.contact,{foreignKey:'user_id',as:'contactDetails'});

//Many-to-Many
// db.user.belongsToMany(db.contact,{through:'user_contacts'});
//now created manually a model
// db.user.belongsToMany(db.contact,{through:db.userContacts});

// db.contact.belongsToMany(db.user,{through:'user_contacts'});
// db.contact.belongsToMany(db.user,{through:db.userContacts});



db.sequelize = sequelize.sync({ force:false})
// db.Sequelize = sequelize.drop()
module.exports = db