import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load .env from the backend root (one level up from backend/backend/)
dotenv.config({ path: resolve(__dirname, '../.env') });

import Razorpay from "razorpay";

// Lazily created so env vars are guaranteed to be loaded
let _razorpayInstance = null;
function getRazorpayInstance() {
  if (!_razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not found in environment variables');
    }
    _razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpayInstance;
}


export const createOrder = async ({ amount, currency = "INR", receipt = null }) => {
  const options = {
    amount: Math.round(Number(amount) * 100), // amount in smallest currency unit (paise)
    currency,
    ...(receipt && { receipt })
  };
  const order = await getRazorpayInstance().orders.create(options);
  return order;
};


// razorpay.js — temporary mock, swap back once Razorpay dashboard is fixed
// export const createOrder = async ({ amount, currency = "INR", receipt = null }) => {
//   console.warn("⚠️ MOCK MODE: Razorpay dashboard is down, returning fake order");
//   return {
//     id: "order_MOCK" + Date.now(),
//     amount: Math.round(Number(amount) * 100),
//     currency,
//     receipt,
//     status: "created"
//   };
// };
