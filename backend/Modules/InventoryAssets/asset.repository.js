// src/repositories/inventory.repository.js

import Inventory from "../InventoryAssets/asset.model.js";

class InventoryRepository {
  async create(data) {
    return await Inventory.create(data);
  }

  async findAll() {
    return await Inventory.findAll({
      order: [["inventory_id", "DESC"]],
    });
  }


  async findBySerialNumber(serial_number) {
  return await Inventory.findOne({
    where: { serial_number }
  });
}

  async findById(id) {
    return await Inventory.findByPk(id);
  }

  async update(id, data) {
    return await Inventory.update(data, {
      where: { inventory_id: id },
    });
  }

  async delete(id) {
    return await Inventory.destroy({
      where: { inventory_id: id },
    });
  }
}

export default new InventoryRepository();