import axiosInstance from '../api/axiosInstance.js';

export const menuService = {
  async fetchMenu() {
    console.log("fetching menu");
    const response = await axiosInstance.get('/inventory/fetch-menu');
    console.log(response.data);
    return response.data?.allItems || response.data?.items || response.data?.data || response.data;

   
  },

  async getCategoryItems(category) {
    const response = await axiosInstance.get(`/inventory/category/${category}`);
    return response.data?.items || response.data?.allItems || response.data?.data || response.data;
  },

  async getItemDetails(id) {
    const response = await axiosInstance.get(`/inventory/fetch-item/${id}`);
    return response.data?.item || response.data;
  },

  async addItem(itemData) {
    const response = await axiosInstance.post('/inventory/admin/add-item', itemData);
    return response.data?.newItem || response.data?.data || response.data;
  },

  async updateItem(id, itemData) {
    const response = await axiosInstance.put(`/inventory/admin/update-item/${id}`, itemData);
    return response.data?.item || response.data;
  },

  async toggleAvailability(id, isAvailable) {
    const response = await axiosInstance.patch(`/inventory/${id}/available`, { isAvailable });
    return response.data;
  },

  async deleteItem(id) {
    const response = await axiosInstance.delete(`/inventory/delete-item/${id}`);
    return response.data;
  },
};

export default menuService;
