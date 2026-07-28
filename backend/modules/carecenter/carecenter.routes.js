import express from "express";
import careCenterController from "./carecenter.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth(["admin"]), careCenterController.create);

router.get("/", auth(["admin"]), careCenterController.getAll);

router.get("/:id", auth(["admin"]), careCenterController.getById);

router.put("/:id", auth(["admin"]), careCenterController.update);

router.delete("/:id", auth(["admin"]), careCenterController.delete);

export default router;