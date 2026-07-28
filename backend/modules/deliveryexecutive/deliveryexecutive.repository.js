import DeliveryExecutive from "./deliveryexecutive.model.js";

class DeliveryExecutiveRepository {
  async create(data) {
    return await DeliveryExecutive.create(data);
  }

  async findAll() {
    return await DeliveryExecutive.findAll({
      order: [["delivery_executive_id", "DESC"]],
    });
  }

  async findById(id) {
    return await DeliveryExecutive.findByPk(id);
  }

  async findByName(delivery_name) {
    return await DeliveryExecutive.findOne({
      where: { delivery_name },
    });
  }

  async update(id, data) {
    return await DeliveryExecutive.update(data, {
      where: {
        delivery_executive_id: id,
      },
    });
  }

  async delete(id) {
    return await DeliveryExecutive.destroy({
      where: {
        delivery_executive_id: id,
      },
    });
  }
}

export default new DeliveryExecutiveRepository();