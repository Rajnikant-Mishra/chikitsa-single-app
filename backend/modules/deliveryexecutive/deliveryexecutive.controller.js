import deliveryExecutiveService from "./deliveryexecutive.service.js";

class DeliveryExecutiveController {
  async create(req, res) {
    try {
      const executive =
        await deliveryExecutiveService.createDeliveryExecutive(req.body);

      return res.status(201).json({
        success: true,
        message: "Delivery Executive created successfully.",
        data: executive,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      const executives =
        await deliveryExecutiveService.getAllDeliveryExecutives();

      return res.status(200).json({
        success: true,
        data: executives,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const executive =
        await deliveryExecutiveService.getDeliveryExecutiveById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: executive,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const executive =
        await deliveryExecutiveService.updateDeliveryExecutive(
          req.params.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message: "Delivery Executive updated successfully.",
        data: executive,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      await deliveryExecutiveService.deleteDeliveryExecutive(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message: "Delivery Executive deleted successfully.",
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new DeliveryExecutiveController();