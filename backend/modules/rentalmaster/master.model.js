// import { DataTypes } from "sequelize";
// import sequelize from "../../config/db.js";

// const Rental = sequelize.define(
//   "Rental",
//   {
//     rental_id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },

//     device_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "devices",
//         key: "device_id",
//       },
//       onUpdate: "CASCADE",
//       onDelete: "RESTRICT",
//     },

//     record_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },

//     login_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: false,
//     },

//     login_out_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },

//     recall_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },

//     // NEW COLUMN
//     deal_type: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },

//     // NEW COLUMN
//     unit_type: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },

//     // NEW COLUMN
//     mode_type: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },

//     billing_type: {
//       type: DataTypes.ENUM("Daily", "Monthly", "Fort Night"),
//       allowNull: false,
//     },

//     rental_charge: {
//       type: DataTypes.DECIMAL(10, 2),
//       defaultValue: 0,
//     },

//     deposit_advance: {
//       type: DataTypes.DECIMAL(10, 2),
//       defaultValue: 0,
//     },

//     installation_charge: {
//       type: DataTypes.DECIMAL(10, 2),
//       defaultValue: 0,
//     },

//     care_center_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: "carecenters",
//         key: "carecenter_id",
//       },
//       onUpdate: "CASCADE",
//       onDelete: "SET NULL",
//     },

//     mob_no: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },

//     alternative_mob_no: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },

//     care_address: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },

//     care_bed_no: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//     },

//     care_poc_name: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },

//     care_referal: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },

//     patient_name: {
//       type: DataTypes.STRING(200),
//       allowNull: false,
//     },

//     patient_age: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     patient_mob_no: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },

//     patient_alternative_mob_no: {
//       type: DataTypes.STRING(20),
//       allowNull: true,
//     },

//     patient_attendant_name: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },

//     patient_delivery_address: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },

//     asset_photos: {
//       type: DataTypes.JSON,
//       allowNull: true,
//       defaultValue: [],
//     },

//     status: {
//       type: DataTypes.ENUM(
//         "Pending",
//         "Delivered",
//         "Running",
//         "Returned",
//         "Closed",
//       ),
//       defaultValue: "Pending",
//     },
//   },
//   {
//     tableName: "rental_master",
//     timestamps: true,
//     underscored: true,
//   },
// );

// export default Rental;


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

    device_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "devices",
        key: "device_id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    // NEW – multi accessory support
    accessory_id: {
      type: DataTypes.JSON,          // stores array of accessory IDs e.g. [1, 5, 12]
      allowNull: true,
      defaultValue: [],
    },

    record_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    login_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    notify_date: {                   // NEW
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    login_out_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    recall_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    deal_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    unit_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    mode_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    billing_type: {
      type: DataTypes.ENUM("Daily", "Monthly", "Fort Night"),
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

    care_center_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "carecenters",
        key: "carecenter_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    mob_no: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    alternative_mob_no: {
      type: DataTypes.STRING(20),
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

    care_referal: {
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

    patient_alternative_mob_no: {
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

    notes: {                         // NEW
      type: DataTypes.TEXT,
      allowNull: true,
    },

    asset_photos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Delivered",
        "Running",
        "Returned",
        "Closed",
      ),
      defaultValue: "Pending",
    },
  },
  {
    tableName: "rental_master",
    timestamps: true,
    underscored: true,
  },
);

export default Rental;