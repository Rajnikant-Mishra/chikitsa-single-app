import careCenterRepository from "./carecenter.repository.js";

class CareCenterService {
  async createCareCenter(data) {
    const {
      carecenter_name,
      address,
      mobile_number,
      alternative_mobile_number,
      status,
    } = data;

    if (!carecenter_name?.trim()) {
      throw new Error("Care Center name is required.");
    }

    if (!address?.trim()) {
      throw new Error("Address is required.");
    }

    if (!mobile_number?.trim()) {
      throw new Error("Mobile number is required.");
    }

    const existing =
      await careCenterRepository.findByName(
        carecenter_name
      );

    if (existing) {
      throw new Error(
        `Care Center '${carecenter_name}' already exists.`
      );
    }

    return await careCenterRepository.create({
      carecenter_name: carecenter_name.trim(),
      address: address.trim(),
      mobile_number,
      alternative_mobile_number,
      status: status || "active",
    });
  }

  async getAllCareCenters() {
    return await careCenterRepository.findAll();
  }

  async getCareCenterById(id) {
    const carecenter =
      await careCenterRepository.findById(id);

    if (!carecenter) {
      throw new Error(`Care Center ID ${id} not found.`);
    }

    return carecenter;
  }

  async updateCareCenter(id, data) {
    const carecenter =
      await this.getCareCenterById(id);

    if (
      data.carecenter_name &&
      data.carecenter_name !== carecenter.carecenter_name
    ) {
      const existing =
        await careCenterRepository.findByName(
          data.carecenter_name
        );

      if (existing) {
        throw new Error(
          `Care Center '${data.carecenter_name}' already exists.`
        );
      }
    }

    await careCenterRepository.update(id, data);

    return await careCenterRepository.findById(id);
  }

  async deleteCareCenter(id) {
    await this.getCareCenterById(id);

    await careCenterRepository.delete(id);

    return true;
  }
}

export default new CareCenterService();