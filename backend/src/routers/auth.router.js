import express from "express";
import { register , verifyEmail , login , forgotPassword, reset_password } from "../controllers/auth.controller.js";
import { userAuthentication } from "../middlewares/auth.middleware.js";
import { emailToResetPassword } from "../services/mail.services.js";
const router = express.Router();

/**
 * POST api/auth/register this route is used to register a new user
 * @param {string} req.body.username 
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @returns 
 */
router.post("/register", register);

/**
 * POST api/auth/verify-email/:token this route is used to verify the email of the user
 * @param {string} req.params.token 
 * @returns 
 */ 
router.get("/verify-email/:token", verifyEmail);

/**
 * GET api/auth/login this route is used to login the user
 * @param {string} req.body.email 
 * @param {string} req.body.password
 * @returns 
 */
router.post("/login", login)



/**
 * POST api/auth/forgot-password this route is used to forgot the password of the user
 * @param {string} req.body.email 
 * @returns 
 */

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", reset_password);
 
export default router; 