import referenceRepository from "./reference.repository.js";

class ReferenceService {
  async createReference(data) {
    const {
      doctor_name,
      specialist,
      mobile_number,
      alternative_number,
      hospital_name,
      status,
    } = data;

    if (!doctor_name?.trim()) {
      throw new Error("Doctor name is required.");
    }

    if (!specialist?.trim()) {
      throw new Error("Specialist is required.");
    }

    if (!mobile_number?.trim()) {
      throw new Error("Mobile number is required.");
    }

    if (!hospital_name?.trim()) {
      throw new Error("Hospital name is required.");
    }

    const existing =
      await referenceRepository.findByDoctorName(
        doctor_name
      );

    if (existing) {
      throw new Error(
        `Doctor '${doctor_name}' already exists.`
      );
    }

    return await referenceRepository.create({
      doctor_name: doctor_name.trim(),
      specialist: specialist.trim(),
      mobile_number,
      alternative_number,
      hospital_name: hospital_name.trim(),
      status: status || "active",
    });
  }

  async getAllReferences() {
    return await referenceRepository.findAll();
  }

  async getReferenceById(id) {
    const reference =
      await referenceRepository.findById(id);

    if (!reference) {
      throw new Error(`Reference ID ${id} not found.`);
    }

    return reference;
  }

  async updateReference(id, data) {
    const reference =
      await this.getReferenceById(id);

    if (
      data.doctor_name &&
      data.doctor_name !== reference.doctor_name
    ) {
      const existing =
        await referenceRepository.findByDoctorName(
          data.doctor_name
        );

      if (existing) {
        throw new Error(
          `Doctor '${data.doctor_name}' already exists.`
        );
      }
    }

    await referenceRepository.update(id, data);

    return await referenceRepository.findById(id);
  }

  async deleteReference(id) {
    await this.getReferenceById(id);

    await referenceRepository.delete(id);

    return true;
  }
}

export default new ReferenceService();