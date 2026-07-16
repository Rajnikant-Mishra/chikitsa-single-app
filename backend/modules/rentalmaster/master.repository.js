import Rental from "./master.model.js";
import Device from "../device/device.model.js";
import CareCenter from "../carecenter/carecenter.model.js"; // Import your CareCenter model

class RentalRepository {
  // ==========================
  // Create Rental
  // ==========================
  async create(data) {
    return await Rental.create(data);
  }

  // ==========================
  // Get All Rentals (With eager loaded relations)
  // ==========================
  async findAll() {
    return await Rental.findAll({
      include: [
        {
          model: Device,
          as: "device",
          attributes: [
            "device_id",
            "device_name",
            "status",
          ],
        },
        {
          model: CareCenter,
          as: "careCenter", // Assumes you defined: Rental.belongsTo(CareCenter, { foreignKey: 'care_center_id', as: 'careCenter' })
          attributes: [
            "carecenter_id",
            "carecenter_name",
            "address",
            "mobile_number",
            "alternative_mobile_number"
          ]
        }
      ],
      order: [["rental_id", "DESC"]],
    });
  }

  // ==========================
  // Get Rental By ID
  // ==========================
  async findById(id) {
    return await Rental.findByPk(id, {
      include: [
        {
          model: Device,
          as: "device",
          attributes: [
            "device_id",
            "device_name",
            "status",
          ],
        },
        {
          model: CareCenter,
          as: "careCenter",
          attributes: [
            "carecenter_id",
            "carecenter_name",
            "address",
            "mobile_number",
            "alternative_mobile_number"
          ]
        }
      ],
    });
  }

  // ==========================
  // Update Rental
  // ==========================
  async update(id, data) {
    const rental = await Rental.findByPk(id);

    if (!rental) {
      return null;
    }

    return await rental.update(data);
  }

  // ==========================
  // Delete Rental
  // ==========================
  async delete(id) {
    const rental = await Rental.findByPk(id);

    if (!rental) {
      return false;
    }

    await rental.destroy();

    return true;
  }
}

export default new RentalRepository();