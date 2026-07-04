import inventoryRepository from "./asset.repository.js";

class InventoryService {
  async createInventory(data) {
    const {
      device_model,
      serial_number,
      running_hours,
      status,
      accessories,
    } = data;

    if (!device_model?.trim()) {
      throw new Error("Device model is required.");
    }

    if (!serial_number?.trim()) {
      throw new Error("Serial number is required.");
    }

    const existingInventory =
      await inventoryRepository.findBySerialNumber(
        serial_number
      );

    if (existingInventory) {
      throw new Error(
        `Serial Number '${serial_number}' already exists.`
      );
    }

    return await inventoryRepository.create({
      device_model,
      serial_number,
      accessories,
      running_hours: running_hours || 0,
      status: status || "available",
    });
  }

  async getAllInventories() {
    return await inventoryRepository.findAll();
  }

  async getInventoryById(id) {
    const inventory =
      await inventoryRepository.findById(id);

    if (!inventory) {
      throw new Error(
        `Inventory ID ${id} not found.`
      );
    }

    return inventory;
  }

  async updateInventory(id, data) {
    const inventory =
      await this.getInventoryById(id);

    if (
      data.serial_number &&
      data.serial_number !== inventory.serial_number
    ) {
      const existingInventory =
        await inventoryRepository.findBySerialNumber(
          data.serial_number
        );

      if (existingInventory) {
        throw new Error(
          `Serial Number '${data.serial_number}' already exists.`
        );
      }
    }

    await inventoryRepository.update(id, data);

    return await inventoryRepository.findById(id);
  }

  async deleteInventory(id) {
    await this.getInventoryById(id);

    await inventoryRepository.delete(id);

    return true;
  }
}

export default new InventoryService();