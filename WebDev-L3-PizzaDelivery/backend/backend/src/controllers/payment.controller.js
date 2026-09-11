import crypto from 'crypto';
import mongoose from 'mongoose';
import OrderModel from '../models/Order.model.js';
import dotenv from 'dotenv/config'; // Loads environment variables
import Razorpay from "razorpay";
import { createOrder } from '../../razorpay.js';

/**
 * @createPaymentOrder - creates a Razorpay order linked to an existing
 * app Order (created earlier via placeOrder)
 * @param {*} req - expects req.body.orderId (your app's Order _id)
 */
export async function createPaymentOrder(req, res) {
  try {
    const orderID = req.body.orderId || req.body.orderID || req.body.order_id;
    if (!orderID) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderID)) {
      return res.status(400).json({ success: false, message: `Invalid Order ID format: '${orderID}'` });
    }

    const order = await OrderModel.findById(orderID);

    if (!order) {
      return res.status(404).json({ success: false, message: `Order not found in database for ID: '${orderID}'` });
    }

    // Verify ownership (or allow if user is admin)
    const requestUserId = req.user?._id?.toString() || req.user?.id?.toString();
    if (requestUserId && order.user.toString() !== requestUserId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Order belongs to a different user account" });
    }

    // Idempotency guard — prevent duplicate Razorpay orders for one paid order
    if (order.paymentStatus === "paid") {
      return res.status(400).json({ success: false, message: "Order already paid" });
    }

    // Reuse existing Razorpay order if one was already created and payment not yet done
    if (order.razorpayOrderId) {
      return res.status(200).json({
        success: true,
        message: "Existing Razorpay order reused",
        razorpayOrderId: order.razorpayOrderId,
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID,
        order
      });
    }

    const razorpayOrder = await createOrder({
      amount: order.totalAmount,
      currency: "INR",
      receipt: order._id.toString()
    });

    // Persist razorpayOrderId to Order document
    order.razorpayOrderId = razorpayOrder.id;
    order.paymentStatus = "pending";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      order
    });
  } catch (err) {
    console.log("ERROR in createPaymentOrder:", err);
    return res.status(500).json({ success: false, message: "Error creating payment order", error: err.message });
  }
}

/**
 * @verifyPayment - verifies Razorpay's signature after checkout completes,
 * then marks the app's Order as paid
 * @param {*} req - expects razorpayOrderId, razorpayPaymentId, signature, orderId
 */
export async function verifyPayment(req, res) {
  try {
    const { razorpayOrderId: rzpOrderIdInput, razorpayOrder, razorpayPaymentId, signature, orderId: orderIdInput } = req.body;
    const razorpayOrderId = rzpOrderIdInput || razorpayOrder;
    const orderId = orderIdInput || req.body.orderID;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Valid Order ID is required for payment verification" });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: `Order not found for ID: '${orderId}'` });
    }

    const requestUserId = req.user?._id?.toString() || req.user?.id?.toString();
    if (requestUserId && order.user.toString() !== requestUserId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Order belongs to a different user account" });
    }

    order.paymentStatus = "paid";
    order.paymentId = razorpayPaymentId;
    order.status = "confirmed";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order
    });
  } catch (err) {
    console.log("ERROR in verifyPayment:", err);
    return res.status(500).json({ success: false, message: "Error verifying payment", error: err.message });
  }
}