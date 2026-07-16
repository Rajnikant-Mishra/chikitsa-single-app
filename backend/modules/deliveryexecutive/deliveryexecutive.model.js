import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const DeliveryExecutive = sequelize.define(
  "DeliveryExecutive",
  {
    delivery_executive_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    delivery_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "delivery_executives",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default DeliveryExecutive;