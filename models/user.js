'use strict';
const {
  Model
} = require('sequelize');
const {createHash} = require('../helpers/bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Course, {foreignKey: 'user_id', through: 'UserCourses'})
    }

    fullname() {
      return this.first_name + ' ' + this.last_name
    }
  };
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    birth_place: DataTypes.STRING,
    birth_date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'User',
      hooks: {
        beforeCreate(userInstance, option) {
          userInstance.password = createHash(userInstance.password, 5);

          if (!userInstance.last_name) {
            userInstance.last_name = userInstance.first_name
          }
        }
      }
  });
  return User;
};