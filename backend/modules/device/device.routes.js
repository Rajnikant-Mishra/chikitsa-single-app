import express from "express";
import deviceController from "./device.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  auth(["admin"]),
  deviceController.create
);

router.get(
  "/",
  auth(["admin"]),
  deviceController.getAll
);

router.get(
  "/:id",
  auth(["admin"]),
  deviceController.getById
);

router.put(
  "/:id",
  auth(["admin"]),
  deviceController.update
);

router.delete(
  "/:id",
  auth(["admin"]),
  deviceController.delete
);

export default router;