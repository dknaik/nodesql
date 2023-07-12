module.exports = (sequelize, DataTypes,User,Contact) => {
const userContacts = sequelize.define('user_contacts', {
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
    tableName:"user_contacts"
  });
  return userContacts
}