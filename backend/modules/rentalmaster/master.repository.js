import Rental from "./master.model.js";
import Device from "../device/device.model.js";
import CareCenter from "../carecenter/carecenter.model.js"; // Import your CareCenter model
import { Op } from "sequelize";

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
  // async findAll() {
  //   return await Rental.findAll({
  //     include: [
  //       {
  //         model: Device,
  //         as: "device",
  //         attributes: [
  //           "device_id",
  //           "device_name",
  //           "status",
  //         ],
  //       },
  //       {
  //         model: CareCenter,
  //         as: "careCenter",
  //         attributes: [
  //           "carecenter_id",
  //           "carecenter_name",
  //           "address",
  //           "mobile_number",
  //           "alternative_mobile_number"
  //         ]
  //       }
  //     ],
  //     order: [["rental_id", "DESC"]],
  //   });
  // }

  async findAll(filters = {}) {
    const { search, deal_type, unit_type, mode_type, care_center_id, status } =
      filters;

    const where = {};

    // Exact filters
    if (deal_type && deal_type !== "All") where.deal_type = deal_type;
    if (unit_type && unit_type !== "All") where.unit_type = unit_type;
    if (mode_type && mode_type !== "All") where.mode_type = mode_type;
    if (status && status !== "All") where.status = status;
    if (care_center_id && care_center_id !== "All") {
      where.care_center_id = care_center_id;
    }

    // Global search (patient, phones, device name, care center name)
    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`;
      where[Op.or] = [
        { patient_name: { [Op.like]: term } },
        { mob_no: { [Op.like]: term } },
        { alternative_mob_no: { [Op.like]: term } },
        { patient_mob_no: { [Op.like]: term } },
        { patient_alternative_mob_no: { [Op.like]: term } },
        { care_poc_name: { [Op.like]: term } },
        { care_referal: { [Op.like]: term } },
        { notes: { [Op.like]: term } },
        { "$device.device_name$": { [Op.like]: term } },
        { "$careCenter.carecenter_name$": { [Op.like]: term } },
      ];
    }

    return await Rental.findAll({
      where,
      include: [
        {
          model: Device,
          as: "device",
          attributes: ["device_id", "device_name", "status"],
          required: false,
        },
        {
          model: CareCenter,
          as: "careCenter",
          attributes: [
            "carecenter_id",
            "carecenter_name",
            "address",
            "mobile_number",
            "alternative_mobile_number",
          ],
          required: false,
        },
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
          attributes: ["device_id", "device_name", "status"],
        },
        {
          model: CareCenter,
          as: "careCenter",
          attributes: [
            "carecenter_id",
            "carecenter_name",
            "address",
            "mobile_number",
            "alternative_mobile_number",
          ],
        },
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
