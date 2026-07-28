import express from "express";
import deliveryExecutiveController from "./deliveryexecutive.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth(["admin"]), deliveryExecutiveController.create);

router.get("/", auth(["admin"]), deliveryExecutiveController.getAll);

router.get("/:id", auth(["admin"]), deliveryExecutiveController.getById);

router.put("/:id", auth(["admin"]), deliveryExecutiveController.update);

router.delete("/:id", auth(["admin"]), deliveryExecutiveController.delete);

export default router;