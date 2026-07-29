import accessoryService from "./accessories.service.js";

class AccessoryController {
  async create(req, res) {
    try {
      const accessory =
        await accessoryService.createAccessory(req.body);

      res.status(201).json({
        success: true,
        message: "Accessory created successfully.",
        data: accessory,
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
      const accessories =
        await accessoryService.getAllAccessories();

      res.status(200).json({
        success: true,
        data: accessories,
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
      const accessory =
        await accessoryService.getAccessoryById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: accessory,
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
      const accessory =
        await accessoryService.updateAccessory(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "Accessory updated successfully.",
        data: accessory,
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
      await accessoryService.deleteAccessory(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: "Accessory deleted successfully.",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AccessoryController();