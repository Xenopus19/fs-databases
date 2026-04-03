const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    expired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "sessions",
    tableName: "sessions",
  },
);

module.exports = Session;
