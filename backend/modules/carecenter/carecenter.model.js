import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const CareCenter = sequelize.define(
  "CareCenter",
  {
    carecenter_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    carecenter_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    alternative_mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "carecenters",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default CareCenter;