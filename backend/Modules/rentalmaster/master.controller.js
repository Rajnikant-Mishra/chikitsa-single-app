import rentalService from "./master.service.js";

class RentalController {
  async create(req, res) {
    try {
      const data = {
        ...req.body,
      };

      if (req.files?.asset_photo?.[0]) {
        data.asset_photo = `/uploads/${req.files.asset_photo[0].filename}`;
      }

      if (req.files?.prescription_photo?.[0]) {
        data.prescription_photo = `/uploads/${req.files.prescription_photo[0].filename}`;
      }

      const rental = await rentalService.createRental(data);

      return res.status(201).json({
        success: true,
        message: "Rental created successfully",
        data: rental,
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
      const rentals = await rentalService.getAllRentals();

      return res.status(200).json({
        success: true,
        count: rentals.length,
        data: rentals,
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
      const rental = await rentalService.getRentalById(req.params.id);

      return res.status(200).json({
        success: true,
        data: rental,
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
      const rental = await rentalService.updateRental(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: "Rental updated successfully",
        data: rental,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      await rentalService.deleteRental(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Rental deleted successfully",
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new RentalController();
