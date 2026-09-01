import express from "express";
import { createPaymentOrder , verifyPayment } from "../controllers/payment.controller.js";

const payRouter = express.Router();

payRouter.post("/create-order", createPaymentOrder);
payRouter.post("/verify", verifyPayment);

export default payRouter;