import careCenterService from "./carecenter.service.js";

class CareCenterController {
  async create(req, res) {
    try {
      const carecenter =
        await careCenterService.createCareCenter(req.body);

      res.status(201).json({
        success: true,
        message: "Care Center created successfully.",
        data: carecenter,
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
      const carecenters =
        await careCenterService.getAllCareCenters();

      res.status(200).json({
        success: true,
        data: carecenters,
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
      const carecenter =
        await careCenterService.getCareCenterById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: carecenter,
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
      const carecenter =
        await careCenterService.updateCareCenter(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "Care Center updated successfully.",
        data: carecenter,
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
      await careCenterService.deleteCareCenter(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: "Care Center deleted successfully.",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CareCenterController();