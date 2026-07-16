import Rental from "./rentalmaster/master.model.js";
import Device from "./device/device.model.js";
import CareCenter from "./carecenter/carecenter.model.js"; // Import CareCenter

// Device <-> Rental Associations
Device.hasMany(Rental, {
  foreignKey: "device_id",
  as: "rentals",
});

Rental.belongsTo(Device, {
  foreignKey: "device_id",
  as: "device",
});


// CareCenter <-> Rental Associations
CareCenter.hasMany(Rental, {
  foreignKey: "care_center_id",
  as: "rentals",
});

Rental.belongsTo(CareCenter, {
  foreignKey: "care_center_id",
  as: "careCenter",
});

export { Rental, Device, CareCenter };