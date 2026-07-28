import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const User = sequelize.define(
  "Admin",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "admin",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;