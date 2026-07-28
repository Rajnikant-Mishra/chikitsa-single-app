import Device from "./device.model.js";

class DeviceRepository {
  async create(data) {
    return await Device.create(data);
  }

  async findAll() {
    return await Device.findAll({
      order: [["device_id", "DESC"]],
    });
  }

  async findById(id) {
    return await Device.findByPk(id);
  }

  async findByName(device_name) {
    return await Device.findOne({
      where: { device_name },
    });
  }

  async update(id, data) {
    return await Device.update(data, {
      where: { device_id: id },
    });
  }

  async delete(id) {
    return await Device.destroy({
      where: { device_id: id },
    });
  }
}

export default new DeviceRepository();