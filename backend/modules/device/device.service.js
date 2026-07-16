import deviceRepository from "./device.repository.js";

class DeviceService {
  async createDevice(data) {
    const { device_name, status } = data;

    if (!device_name?.trim()) {
      throw new Error("Device name is required.");
    }

    const existingDevice =
      await deviceRepository.findByName(device_name);

    if (existingDevice) {
      throw new Error(
        `Device '${device_name}' already exists.`
      );
    }

    return await deviceRepository.create({
      device_name: device_name.trim(),
      status: status || "active",
    });
  }

  async getAllDevices() {
    return await deviceRepository.findAll();
  }

  async getDeviceById(id) {
    const device = await deviceRepository.findById(id);

    if (!device) {
      throw new Error(`Device ID ${id} not found.`);
    }

    return device;
  }

  async updateDevice(id, data) {
    const device = await this.getDeviceById(id);

    if (
      data.device_name &&
      data.device_name !== device.device_name
    ) {
      const existing =
        await deviceRepository.findByName(
          data.device_name
        );

      if (existing) {
        throw new Error(
          `Device '${data.device_name}' already exists.`
        );
      }
    }

    await deviceRepository.update(id, data);

    return await deviceRepository.findById(id);
  }

  async deleteDevice(id) {
    await this.getDeviceById(id);

    await deviceRepository.delete(id);

    return true;
  }
}

export default new DeviceService();