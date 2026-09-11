import axiosInstance from '../api/axiosInstance.js';

export const orderService = {
  async placeOrder(addressId, orderData) {
    const response = await axiosInstance.post(`/order/place/${addressId}`, orderData);
    console.log("ORDER :" , response);
    return response.data?.order || response.data;
  },

  async getUserOrders() {
    console.log("🟢 fetching orders...");
    const response = await axiosInstance.get('/order/allOrders');
    return response.data?.order || response.data?.orders || response.data;
  },

  async getOrderById(id) {
    const response = await axiosInstance.get(`/order/get-order/${id}`);
    return response.data?.order || response.data;
  },

  async cancelOrder(id) {
    const response = await axiosInstance.delete(`/order/cancel-order/${id}`);
    return response.data?.order || response.data;
  },

  async adminGetAllOrders() {
    const response = await axiosInstance.get('/order/admin/all');
    return response.data?.data || response.data?.orders || response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await axiosInstance.put(`/order/admin/${id}/status`, { status });
    return response.data?.order || response.data;
  },
};

export default orderService;
