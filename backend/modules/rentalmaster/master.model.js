import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Rental = sequelize.define(
  "Rental",
  {
    rental_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Selected device/serial number",
    },

    login_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    login_out_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    delivery_executive: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    billing_type: {
      type: DataTypes.ENUM("Daily", "Monthly"),
      allowNull: false,
    },

    rental_charge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    deposit_advance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    installation_charge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    care_center_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    care_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    care_bed_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    care_poc_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    patient_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    patient_age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    patient_mob_no: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    patient_attendant_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    patient_delivery_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    asset_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    prescription_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Delivered",
        "Running",
        "Returned",
        "Closed"
      ),
      defaultValue: "Pending",
    },
  },
  {
    tableName: "rental_master",
    timestamps: true,
    underscored: true,
  }
);

export default Rental;