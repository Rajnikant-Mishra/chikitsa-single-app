import deliveryExecutiveRepository from "./deliveryexecutive.repository.js";

class DeliveryExecutiveService {
  async createDeliveryExecutive(data) {
    const {
      delivery_name,
      mobile_number,
      status,
    } = data;

    if (!delivery_name?.trim()) {
      throw new Error("Delivery executive name is required.");
    }

    if (!mobile_number?.trim()) {
      throw new Error("Mobile number is required.");
    }

    const existing =
      await deliveryExecutiveRepository.findByName(
        delivery_name
      );

    if (existing) {
      throw new Error(
        `Delivery Executive '${delivery_name}' already exists.`
      );
    }

    return await deliveryExecutiveRepository.create({
      delivery_name: delivery_name.trim(),
      mobile_number,
      status: status || "active",
    });
  }

  async getAllDeliveryExecutives() {
    return await deliveryExecutiveRepository.findAll();
  }

  async getDeliveryExecutiveById(id) {
    const executive =
      await deliveryExecutiveRepository.findById(id);

    if (!executive) {
      throw new Error(
        `Delivery Executive ID ${id} not found.`
      );
    }

    return executive;
  }

  async updateDeliveryExecutive(id, data) {
    const executive =
      await this.getDeliveryExecutiveById(id);

    if (
      data.delivery_name &&
      data.delivery_name !== executive.delivery_name
    ) {
      const existing =
        await deliveryExecutiveRepository.findByName(
          data.delivery_name
        );

      if (existing) {
        throw new Error(
          `Delivery Executive '${data.delivery_name}' already exists.`
        );
      }
    }

    await deliveryExecutiveRepository.update(id, data);

    return await deliveryExecutiveRepository.findById(id);
  }

  async deleteDeliveryExecutive(id) {
    await this.getDeliveryExecutiveById(id);

    await deliveryExecutiveRepository.delete(id);

    return true;
  }
}

export default new DeliveryExecutiveService();