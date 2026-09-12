



import cookieParser from "cookie-parser";

import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);




import connectDB from "./config/database.js";
import router from "./routers/auth.router.js";
import cors from 'cors';
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
 
const allowedOrigins = [
  (process.env.CLIENT_URL || 'http://localhost:5173').trim(),
  "https://pizza-frontend.onrender.com",
  "https://lizza.onrender.com",
  "https://lizza-iota.vercel.app"
]
// index.js

// Create an array of allowed origins
const allowedOrigins = [
  'http://localhost:5173', // Your local Vite frontend
  process.env.CLIENT_URL   // Automatically pulls your Vercel URL when deployed
].filter(Boolean);          // Removes undefined values if CLIENT_URL isn't set yet

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Crucial for sending cookies/sessions
}));

// 🟢 CRUCIAL: Explicitly catch and auto-approve browser preflight requests
app.options('*', cors());

connectDB()
app.use("/api/auth", router);
app.use("/api/inventory",  inventoryRouter);
app.use('/api/address', userAuthentication, addressRouter);
app.use("/api/order", userAuthentication,  orderRouter);
app.use("/api/payment" ,userAuthentication, payRouter)
export default app;   
