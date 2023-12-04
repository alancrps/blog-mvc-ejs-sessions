import express from "express";
import { loginController, logoutController, quiensoyController } from "../controllers/auth.controller";

const authRoutes = express.Router();

// Ruta de inicio de sesión
authRoutes.get('/login', loginController);

authRoutes.get('/quiensoy', quiensoyController);

authRoutes.get('/logout', logoutController)

export default authRoutes;