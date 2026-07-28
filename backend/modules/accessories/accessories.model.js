import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Accessory = sequelize.define(
  "Accessory",
  {
    accessory_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    accessory_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "accessories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Accessory;