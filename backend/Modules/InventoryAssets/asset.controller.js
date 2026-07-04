// src/controllers/inventory.controller.js

import inventoryService from "./asset.service.js";

class InventoryController {
  async create(req, res) {
    try {
      const inventory =
        await inventoryService.createInventory(req.body);

      return res.status(201).json({
        success: true,
        data: inventory,
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
      const inventories =
        await inventoryService.getAllInventories();

      return res.status(200).json({
        success: true,
        data: inventories,
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
      const inventory =
        await inventoryService.getInventoryById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: inventory,
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
      const inventory =
        await inventoryService.updateInventory(
          req.params.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: inventory,
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
      await inventoryService.deleteInventory(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message: "Inventory deleted successfully",
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new InventoryController();