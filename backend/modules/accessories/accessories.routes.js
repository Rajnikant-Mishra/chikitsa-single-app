import express from "express";
import accessoryController from "./accessories.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  auth(["admin"]),
  accessoryController.create
);

router.get(
  "/",
  auth(["admin"]),
  accessoryController.getAll
);

router.get(
  "/:id",
  auth(["admin"]),
  accessoryController.getById
);

router.put(
  "/:id",
  auth(["admin"]),
  accessoryController.update
);

router.delete(
  "/:id",
  auth(["admin"]),
  accessoryController.delete
);

export default router;