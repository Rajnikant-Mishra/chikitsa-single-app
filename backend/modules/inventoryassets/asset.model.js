

import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Inventory = sequelize.define(
  "Inventory",
  {
    inventory_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    device_model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    serial_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    accessories: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    running_hours: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM(
        "available",
        "rented",
        "maintenance",
        "breakdown"
      ),
      defaultValue: "available",
    },
  },
  {
    tableName: "inventories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Inventory;