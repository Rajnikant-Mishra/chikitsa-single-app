import rentalRepository from "./master.repository.js";

class RentalService {
  async createRental(data) {
    return await rentalRepository.create(data);
  }

  async getAllRentals() {
    return await rentalRepository.findAll();
  }

  async getRentalById(rental_id) {
    const rental = await rentalRepository.findById(rental_id);

    if (!rental) {
      throw new Error("Rental not found");
    }

    return rental;
  }

  async updateRental(rental_id, data) {
    const rental = await rentalRepository.update(
      rental_id,
      data
    );

    if (!rental) {
      throw new Error("Rental not found");
    }

    return rental;
  }

  async deleteRental(rental_id) {
    const deleted = await rentalRepository.delete(
      rental_id
    );

    if (!deleted) {
      throw new Error("Rental not found");
    }

    return true;
  }
}

export default new RentalService();