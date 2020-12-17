'use strict';
const {
  Model
} = require('sequelize');
const {createHash} = require('../helpers/bcrypt');

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

    static totalCredits(model, user_id) {
      return new Promise((resolve, reject) => {
        User.findOne({where: {id: user_id}, include: model})
          .then(user => {
            let totalCredit = 0;

            if (user.Courses.length == 0) {
              resolve(totalCredit)
            } else {
              user.Courses.forEach(e => {
                totalCredit += +e.credits
              })

              resolve(totalCredit)
            }
          })
      })
    }

    fullname() {
      return this.first_name + ' ' + this.last_name
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        isSpace(value) {
          if (value.includes(" ") || value == '') {
            throw new Error('Username cannot be empty and MUST NOT contain SPACES!')
          }
        }
      },

    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty!'
        }
      }
    },
    first_name:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'First name cannot be empty!'
        }
      }
      
    },
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Please check your email format!'
        }
      }
    },
    gender: DataTypes.STRING,
    birth_place: DataTypes.STRING,
    birth_date: DataTypes.DATEONLY,
    img: DataTypes.STRING
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