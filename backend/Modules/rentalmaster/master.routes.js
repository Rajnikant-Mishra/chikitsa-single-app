import express from "express";
import rentalController from "./master.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

router.post(
  "/", auth(["admin"]),
   upload.fields([
    { name: "asset_photo", maxCount: 1 },
    { name: "prescription_photo", maxCount: 1 },
  ]),
  rentalController.create
);

router.get(
  "/", auth(["admin"]),
  rentalController.getAll
);

router.get(
  "/:id", auth(["admin"]),
  rentalController.getById
);

router.put(
  "/:id", auth(["admin"]),
  rentalController.update
);

router.delete(
  "/:id", auth(["admin"]),
  rentalController.delete
);

export default router;