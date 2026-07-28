import express from "express";
import referenceController from "./reference.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth(["admin"]), referenceController.create);

router.get("/", auth(["admin"]), referenceController.getAll);

router.get("/:id", auth(["admin"]), referenceController.getById);

router.put("/:id", auth(["admin"]), referenceController.update);

router.delete("/:id", auth(["admin"]), referenceController.delete);

export default router;