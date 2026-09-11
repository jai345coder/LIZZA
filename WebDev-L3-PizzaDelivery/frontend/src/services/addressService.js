import axiosInstance from '../api/axiosInstance.js';

export const addressService = {
  async getAddresses(userID) {
    if (!userID) return [];
    const response = await axiosInstance.get(`/address/get-all-address/${userID}`);
    return response.data?.addresses || response.data;
  },

  async getAddressById(id) {
    const response = await axiosInstance.get(`/address/get-address/${id}`);
    return response.data?.address || response.data;
  },

  async addAddress(userID, addressData) {
    const response = await axiosInstance.post(`/address/add-address/${userID}`, addressData);
    return response.data?.newAddress || response.data?.address || response.data;
  },

  async updateAddress(id, addressData) {
    const response = await axiosInstance.put(`/address/update-address/${id}`, addressData);
    return response.data?.address || response.data;
  },

  async setDefault(id) {
    const response = await axiosInstance.put(`/address/mark-default-address/${id}`);
    return response.data?.address || response.data;
  },
};

export default addressService;
