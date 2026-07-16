import CareCenter from "./carecenter.model.js";

class CareCenterRepository {
  async create(data) {
    return await CareCenter.create(data);
  }

  async findAll() {
    return await CareCenter.findAll({
      order: [["carecenter_id", "DESC"]],
    });
  }

  async findById(id) {
    return await CareCenter.findByPk(id);
  }

  async findByName(carecenter_name) {
    return await CareCenter.findOne({
      where: { carecenter_name },
    });
  }

  async update(id, data) {
    return await CareCenter.update(data, {
      where: { carecenter_id: id },
    });
  }

  async delete(id) {
    return await CareCenter.destroy({
      where: { carecenter_id: id },
    });
  }
}

export default new CareCenterRepository();