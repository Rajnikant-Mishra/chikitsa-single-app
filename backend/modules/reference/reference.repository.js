import Reference from "./reference.model.js";

class ReferenceRepository {
  async create(data) {
    return await Reference.create(data);
  }

  async findAll() {
    return await Reference.findAll({
      order: [["reference_id", "DESC"]],
    });
  }

  async findById(id) {
    return await Reference.findByPk(id);
  }

  async findByDoctorName(doctor_name) {
    return await Reference.findOne({
      where: { doctor_name },
    });
  }

  async update(id, data) {
    return await Reference.update(data, {
      where: {
        reference_id: id,
      },
    });
  }

  async delete(id) {
    return await Reference.destroy({
      where: {
        reference_id: id,
      },
    });
  }
}

export default new ReferenceRepository();