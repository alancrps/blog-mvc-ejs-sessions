import express from "express";
import { loginController, loginControllerView, logoutController, quiensoyController } from "../controllers/auth.controller";

const authRoutes = express.Router();

// Ruta de inicio de sesión
authRoutes.get('/login', loginControllerView);
authRoutes.post('/login', loginController)

authRoutes.get('/quiensoy', quiensoyController);

authRoutes.get('/logout', logoutController)

export default authRoutes;