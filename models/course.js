'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsToMany(models.User, {foreignKey: 'course_id', through: 'UserCourses'})
    }
  };
  Course.init({
    course_name: DataTypes.STRING,
    credits: DataTypes.INTEGER,
    lecturer: DataTypes.STRING,
    max_students: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};