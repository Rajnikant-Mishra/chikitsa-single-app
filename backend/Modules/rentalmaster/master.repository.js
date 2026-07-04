// import Rental from "./master.model.js";
// import Inventory from "../InventoryAssets/asset.model.js";
import {
  Rental,
  Inventory,
} from "../../Modules/associations.js";

class RentalRepository {
  async create(data) {
    return await Rental.create(data);
  }

async findAll() {
    return await Rental.findAll({
      include: [
        {
          model: Inventory,
          as: "inventory",
          attributes: [
            "inventory_id",
            "device_model",
            "serial_number",
            "accessories",
          ],
        },
      ],
      order: [["rental_id", "DESC"]],
    });
  }

  async findById(rental_id) {
    return await Rental.findByPk(rental_id);
  }

  async update(rental_id, data) {
    const rental = await Rental.findByPk(rental_id);

    if (!rental) return null;

    return await rental.update(data);
  }

  async delete(rental_id) {
    const rental = await Rental.findByPk(rental_id);

    if (!rental) return null;

    await rental.destroy();

    return true;
  }
}

export default new RentalRepository();