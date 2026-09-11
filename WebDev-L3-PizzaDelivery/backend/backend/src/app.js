



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

const allowedOrigins = [
  "https://lizza-iota.vercel.app",
  "https://pizza-frontend.onrender.com",
  "https://lizza.onrender.com"
];

// If CLIENT_URL exists, clean it up and add it dynamically
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.trim());
}

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow server-to-server or tools like Postman/cURL (no origin)
    if (!origin) {
      return callback(null, true);
    }
    
    const cleanOrigin = origin.trim();

    // 2. Exact match against our trusted array OR check for vercel subdomains
    if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      console.error(`❌ CORS Blocked: ${cleanOrigin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
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
