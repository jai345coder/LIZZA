import axiosInstance from '../api/axiosInstance.js';

export const paymentService = {
  async createPaymentOrder(orderId) {
    console.log("Payment aopi fetching...")
    const response = await axiosInstance.post('/payment/create-order', { orderId });
    return response.data;
  },

  async verifyPayment(paymentDetails) {
    console.log("verify payment ....")
    const response = await axiosInstance.post('/payment/verify', paymentDetails );
    return response.data;
  },
};

export default paymentService;
