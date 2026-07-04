// src/routes/inventory.routes.js

import express from "express";
import inventoryController from "./asset.controller.js";
import { auth } from "../../middleware/auth.middleware.js"; 

const router = express.Router();

router.post("/", auth(["admin"]), inventoryController.create);

router.get("/", auth(["admin"]), inventoryController.getAll);

router.get("/:id", auth(["admin"]), inventoryController.getById);

router.put("/:id", auth(["admin"]), inventoryController.update);

router.delete("/:id", auth(["admin"]), inventoryController.delete);

export default router;