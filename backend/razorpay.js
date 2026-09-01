import 'dotenv/config';
 // This loads environment variables instantly
 
import Razorpay from "razorpay";

console.log("--- SYSTEM ENVIRONMENT CHECK ---");
console.log("Raw Key ID Variable:", "[NOT ALLOWED]");
console.log("Is Secret Variable Present?:", !!process.env.RAZORPAY_KEY_SECRET);
console.log("--------------------------------");

const RazorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const createOrder = async ({ amount, currency = "INR", receipt = null }) => {
  const options = {
    amount: Math.round(Number(amount) * 100), // amount in smallest currency unit (paise)
    currency,
    ...(receipt && { receipt })
  };
console.log("--- SYSTEM ENVIRONMENT CHECK ---");
console.log("Raw Key ID Variable:", process.env.RAZORPAY_KEY_ID);
console.log("Is Secret Variable Present?:", !!process.env.RAZORPAY_KEY_SECRET);
console.log("--------------------------------");
  const order = await RazorpayInstance.orders.create(options);
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
