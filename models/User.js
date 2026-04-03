const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "the_password",
      unique: false,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "users",
  },
);

module.exports = User;
