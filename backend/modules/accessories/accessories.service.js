import accessoryRepository from "./accessories.repository.js";

class AccessoryService {
  async createAccessory(data) {
    const { accessory_name, status } = data;

    if (!accessory_name?.trim()) {
      throw new Error("Accessory name is required.");
    }

    const existing =
      await accessoryRepository.findByName(accessory_name);

    if (existing) {
      throw new Error(
        `Accessory '${accessory_name}' already exists.`
      );
    }

    return await accessoryRepository.create({
      accessory_name: accessory_name.trim(),
      status: status || "active",
    });
  }

  async getAllAccessories() {
    return await accessoryRepository.findAll();
  }

  async getAccessoryById(id) {
    const accessory =
      await accessoryRepository.findById(id);

    if (!accessory) {
      throw new Error(`Accessory ID ${id} not found.`);
    }

    return accessory;
  }

  async updateAccessory(id, data) {
    const accessory =
      await this.getAccessoryById(id);

    if (
      data.accessory_name &&
      data.accessory_name !== accessory.accessory_name
    ) {
      const existing =
        await accessoryRepository.findByName(
          data.accessory_name
        );

      if (existing) {
        throw new Error(
          `Accessory '${data.accessory_name}' already exists.`
        );
      }
    }

    await accessoryRepository.update(id, data);

    return await accessoryRepository.findById(id);
  }

  async deleteAccessory(id) {
    await this.getAccessoryById(id);

    await accessoryRepository.delete(id);

    return true;
  }
}

export default new AccessoryService();