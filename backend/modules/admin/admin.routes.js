import express from "express";
import authController from "./admin.controller.js";
import { auth } from "../../middleware/auth.middleware.js";


const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", auth(), authController.logout);

export default router;