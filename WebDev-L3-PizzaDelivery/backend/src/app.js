



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


// List of origins allowed by default (production + known static domains)
const allowedOrigins = [
  (process.env.CLIENT_URL || 'http://localhost:5173').trim(),
  "https://pizza-frontend.onrender.com",
  "https://lizza.onrender.com",
  "https://lizza-iota.vercel.app",
  "https://lizza20.vercel.app" // added: your current production domain
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // allow exact matches from the static list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // allow any Vercel preview deployment of this project
    // (Vercel preview URLs look like: lizza20-<hash>-whitewolf22.vercel.app)
    if (/^https:\/\/lizza20-[a-z0-9]+-whitewolf22\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true // Crucial for sending cookies/sessions
}));

// Explicitly catch and auto-approve browser preflight requests
app.options('*', cors());

connectDB()
app.use("/api/auth", router);
app.use("/api/inventory",  inventoryRouter);
app.use('/api/address', userAuthentication, addressRouter);
app.use("/api/order", userAuthentication,  orderRouter);
app.use("/api/payment" ,userAuthentication, payRouter)
export default app;   
