import fs from "fs";
import path from "path";
import rentalService from "../rentalmaster/master.service.js";

// Make sure this matches your exact upload storage path
const uploadPath = path.join(process.cwd(), "uploads", "documents");

// CREATE RENTAL
export const createRental = async (req, res) => {
  try {
    let assetPhotos = [];

    if (req.files?.asset_photos?.length > 0) {
      assetPhotos = req.files.asset_photos.map((file) => file.filename);
    }

    const rentalData = {
      ...req.body,
      // Ensure numeric IDs don't get stuck as empty strings
      care_center_id: req.body.care_center_id
        ? Number(req.body.care_center_id)
        : null,
      device_id: req.body.device_id ? Number(req.body.device_id) : null,
      asset_photos: assetPhotos,
    };

    const rental = await rentalService.createRental(rentalData);

    return res.status(201).json({
      success: true,
      message: "Rental created successfully.",
      data: rental,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL RENTALS
// export const getAllRentals = async (req, res) => {
//   try {
//     const rentals = await rentalService.getAllRentals();

//     return res.status(200).json({
//       success: true,
//       count: rentals.length,
//       data: rentals,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const getAllRentals = async (req, res) => {
  try {
    const rentals = await rentalService.getAllRentals(req.query);

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
};

// GET RENTAL BY ID
export const getRentalById = async (req, res) => {
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
};

// UPDATE RENTAL
export const updateRental = async (req, res) => {
  try {
    const rental = await rentalService.getRentalById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found.",
      });
    }

    let assetPhotos = rental.asset_photos || [];

    // New images uploaded
    if (req.files?.asset_photos?.length > 0) {
      // Delete old images cleanly from filesystem
      if (Array.isArray(assetPhotos)) {
        assetPhotos.forEach((image) => {
          const imagePath = path.join(uploadPath, image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }

      // Save new filenames
      assetPhotos = req.files.asset_photos.map((file) => file.filename);
    }

    const updateData = {
      ...req.body,
      care_center_id: req.body.care_center_id
        ? Number(req.body.care_center_id)
        : null,
      device_id: req.body.device_id ? Number(req.body.device_id) : null,
      asset_photos: assetPhotos,
    };

    const updatedRental = await rentalService.updateRental(
      req.params.id,
      updateData,
    );

    return res.status(200).json({
      success: true,
      message: "Rental updated successfully.",
      data: updatedRental,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE RENTAL
export const deleteRental = async (req, res) => {
  try {
    const rental = await rentalService.getRentalById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found.",
      });
    }

    // Delete uploaded images
    if (rental.asset_photos && Array.isArray(rental.asset_photos)) {
      rental.asset_photos.forEach((image) => {
        const imagePath = path.join(uploadPath, image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await rentalService.deleteRental(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Rental deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
