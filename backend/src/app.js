


import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);




import connectDB from "./config/database.js";
import router from "./routers/auth.router.js";
//import cors from "cors";
import express from "express";
import inventoryRouter from "./routers/inventory.router.js";
import addressRouter from "./routers/address.router.js";
import orderRouter from "./routers/order.router.js";
import payRouter from "./routers/payment.router.js";
import { userAuthentication } from "./middlewares/auth.middleware.js";

// index.js
const app = express();
app.use(express.json());
app.use(cookieParser());
 
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

connectDB()
app.use("/api/auth", router);
app.use("/api/inventory",  inventoryRouter);
app.use('/api/address', userAuthentication, addressRouter);
app.use("/api/order", userAuthentication,  orderRouter);
app.use("/api/payment" ,userAuthentication, payRouter)
export default app;   
