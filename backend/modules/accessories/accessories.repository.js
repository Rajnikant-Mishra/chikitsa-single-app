import Accessory from "./accessories.model.js";

class AccessoryRepository {
  async create(data) {
    return await Accessory.create(data);
  }

  async findAll() {
    return await Accessory.findAll({
      order: [["accessory_id", "DESC"]],
    });
  }

  async findById(id) {
    return await Accessory.findByPk(id);
  }

  async findByName(accessory_name) {
    return await Accessory.findOne({
      where: { accessory_name },
    });
  }

  async update(id, data) {
    return await Accessory.update(data, {
      where: {
        accessory_id: id,
      },
    });
  }

  async delete(id) {
    return await Accessory.destroy({
      where: {
        accessory_id: id,
      },
    });
  }
}

export default new AccessoryRepository();