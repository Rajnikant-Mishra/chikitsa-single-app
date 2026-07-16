// src/modules/device/device.model.js

import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Device = sequelize.define(
  "Device",
  {
    device_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    device_name: {
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
    tableName: "devices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Device;