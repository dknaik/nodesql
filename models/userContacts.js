module.exports = (sequelize, DataTypes,User,Contact) => {
const userContacts = sequelize.define('userContacts', {
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User, // 'Movies' would also work
        key: 'id'
      }
    },
    ContactId: {
      type: DataTypes.INTEGER,
      references: {
        model: Contact, // 'Actors' would also work
        key: 'id'
      }
    }
  },{
    timestamps:false
  },{
    tableName:"userContacts"
  });
  return userContacts
}