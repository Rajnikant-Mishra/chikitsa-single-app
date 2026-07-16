import express from "express";

import {
  createRental,
  getAllRentals,
  getRentalById,
  updateRental,
  deleteRental,
} from "./master.controller.js";

import { auth } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

// =========================
// CREATE RENTAL
// =========================
router.post(
  "/",
  auth(["admin"]),
  upload.fields([
    {
      name: "asset_photos",
      maxCount: 10,
    },
  ]),
  createRental
);

// =========================
// GET ALL RENTALS
// =========================
router.get(
  "/",
  auth(["admin"]),
  getAllRentals
);

// =========================
// GET RENTAL BY ID
// =========================
router.get(
  "/:id",
  auth(["admin"]),
  getRentalById
);

// =========================
// UPDATE RENTAL
// =========================
router.put(
  "/:id",
  auth(["admin"]),
  upload.fields([
    {
      name: "asset_photos",
      maxCount: 10,
    },
  ]),
  updateRental
);

// =========================
// DELETE RENTAL
// =========================
router.delete(
  "/:id",
  auth(["admin"]),
  deleteRental
);

export default router;