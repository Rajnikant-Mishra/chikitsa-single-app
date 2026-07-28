import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Reference = sequelize.define(
  "Reference",
  {
    reference_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    doctor_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    specialist: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    alternative_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },

    hospital_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "references",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Reference;