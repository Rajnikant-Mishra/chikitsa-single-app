import referenceService from "./reference.service.js";

class ReferenceController {
  async create(req, res) {
    try {
      const reference =
        await referenceService.createReference(req.body);

      return res.status(201).json({
        success: true,
        message: "Reference created successfully.",
        data: reference,
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
      const references =
        await referenceService.getAllReferences();

      return res.status(200).json({
        success: true,
        data: references,
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
      const reference =
        await referenceService.getReferenceById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: reference,
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
      const reference =
        await referenceService.updateReference(
          req.params.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message: "Reference updated successfully.",
        data: reference,
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
      await referenceService.deleteReference(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message: "Reference deleted successfully.",
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ReferenceController();