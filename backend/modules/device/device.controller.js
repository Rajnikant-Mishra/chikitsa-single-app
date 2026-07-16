import deviceService from "./device.service.js";

class DeviceController {
  async create(req, res) {
    try {
      const device =
        await deviceService.createDevice(req.body);

      res.status(201).json({
        success: true,
        message: "Device created successfully.",
        data: device,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      const devices =
        await deviceService.getAllDevices();

      res.status(200).json({
        success: true,
        data: devices,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const device =
        await deviceService.getDeviceById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: device,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const device =
        await deviceService.updateDevice(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "Device updated successfully.",
        data: device,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      await deviceService.deleteDevice(req.params.id);

      res.status(200).json({
        success: true,
        message: "Device deleted successfully.",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new DeviceController();