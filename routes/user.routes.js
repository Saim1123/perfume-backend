import { Router } from "express";
import {
  signup,
  login,
  resetPassword,
  forgotPassword,
  verifyEmail,
  userDashboard,
  checkAuth,
  logout,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/dashboard", verifyToken, userDashboard);

export default router;
