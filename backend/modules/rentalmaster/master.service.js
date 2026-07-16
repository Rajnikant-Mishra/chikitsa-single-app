import rentalRepository from "./master.repository.js";

class RentalService {
  // ==========================
  // Create Rental
  // ==========================
  async createRental(data) {
    return await rentalRepository.create(data);
  }

  // ==========================
  // Get All Rentals
  // ==========================
  async getAllRentals() {
    return await rentalRepository.findAll();
  }

  // ==========================
  // Get Rental By ID
  // ==========================
  async getRentalById(id) {
    const rental = await rentalRepository.findById(id);

    if (!rental) {
      throw new Error("Rental record not found.");
    }

    return rental;
  }

  // ==========================
  // Update Rental
  // ==========================
  async updateRental(id, data) {
    const rental = await rentalRepository.update(id, data);

    if (!rental) {
      throw new Error("Rental record not found.");
    }

    return rental;
  }

  // ==========================
  // Delete Rental
  // ==========================
  async deleteRental(id) {
    const deleted = await rentalRepository.delete(id);

    if (!deleted) {
      throw new Error("Rental record not found.");
    }

    return true;
  }
}

export default new RentalService();