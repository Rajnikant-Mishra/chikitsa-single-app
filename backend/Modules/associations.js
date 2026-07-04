import Rental from "../modules/rentalmaster/master.model.js";
import Inventory from "../modules/InventoryAssets/asset.model.js";

Rental.belongsTo(Inventory, {
  foreignKey: "inventory_id",
  as: "inventory",
});

Inventory.hasMany(Rental, {
  foreignKey: "inventory_id",
  as: "rentals",
});

export { Rental, Inventory };