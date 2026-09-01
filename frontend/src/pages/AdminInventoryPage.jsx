import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar.jsx';
import StickerBadge from '../components/StickerBadge.jsx';
import menuService from '../services/menuService.js';

/**
 * Page 9: Admin Inventory Dashboard Page
 */
export default function AdminInventoryPage({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'PIZZA',
    price: 15.99,
    sizes: ['Small', 'Medium', 'Large'],
    toppings: ['Pepperoni', 'Cheese'],
    isAvailable: true,
  });

  const loadInventory = async () => {
    try {
      setLoading(true);

      const data = await menuService.fetchMenu();
      setItems(data);
      console.log("INVENTORY DATA :", data);
    } catch (err) {
      console.warn('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }

    alert("inventory loaded");
  };

  useEffect(() => {
    loadInventory();
  }, []);
  console.log(items);
  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        basePrice: parseFloat(form.price) || 0,
      };
      if (editingId) {
        await menuService.updateItem(editingId, payload);
        setMsg('Item updated successfully! ✅');
      } else {
        await menuService.addItem(payload);
        setMsg('New item created successfully! ✅');
      }
      setShowAddForm(false);
      setEditingId(null);
      setForm({ name: '', category: 'PIZZA', price: 15.99, sizes: ['Small', 'Medium', 'Large'], toppings: ['Pepperoni'], isAvailable: true });
      loadInventory();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving item.');
    }
  };

  const handleRestockStock = async (id, name, currentStock) => {
    const confirmation = window.prompt(
      `[ADMIN PERMISSION REQUIRED]\nItem "${name}" currently has low stock (${currentStock} left).\n\nEnter restock quantity to refill inventory (minimum 5):`,
      '50'
    );
    if (confirmation === null) return;

    const newStock = parseInt(confirmation, 10);
    if (isNaN(newStock) || newStock < 5) {
      alert('Please enter a valid restock quantity of 5 or more to mark item in-stock.');
      return;
    }

    try {
      await menuService.updateItem(id, { stock: newStock, isAvailable: true });
      setItems((prev) =>
        prev.map((i) => (i._id === id ? { ...i, stock: newStock, isAvailable: true } : i))
      );
      setMsg(`Stock for "${name}" successfully restocked to ${newStock} units! ✅`);
    } catch (err) {
      setMsg('Error restocking item.');
    }
  };

  const handleToggleAvailability = async (id, currentAvailability) => {
    try {
      await menuService.toggleAvailability(id, !currentAvailability);
      setItems((prev) =>
        prev.map((i) => (i._id === id ? { ...i, isAvailable: !currentAvailability } : i))
      );
    } catch (err) {
      setMsg('Error toggling availability.');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await menuService.deleteItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      setMsg('Item deleted.');
    } catch (err) {
      setMsg('Failed to delete item.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF5F0] flex flex-col lg:flex-row text-[#1E1E1E] overflow-y-auto">
      {/* Admin Sidebar */}
      <AdminSidebar activeTab="admin-inventory" onNavigate={onNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white neo-card p-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading font-black text-3xl text-[#1E1E1E] uppercase tracking-tight">
                  INVENTORY MANAGEMENT 📦
                </h1>
                <StickerBadge text="ADMIN CONTROL" variant="yellow" rotate="right" size="sm" />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Manage menu items, toggle availability, and edit prices
              </p>
            </div>

            <button
              onClick={() => {
                setEditingId(null);
                setForm({ name: '', category: 'PIZZA', price: 15.99, sizes: ['Small', 'Medium', 'Large'], toppings: ['Pepperoni'], isAvailable: true });
                setShowAddForm(!showAddForm);
              }}
              className="neo-btn py-3 px-5 bg-[#CCFF00] text-[#1E1E1E] font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
            >
              {showAddForm ? 'Cancel' : '+ ADD NEW ITEM'}
            </button>
          </div>

          {msg && (
            <div className="p-3 bg-emerald-100 neo-border border-emerald-500 text-emerald-800 font-bold text-xs rounded-xl">
              {msg}
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <form onSubmit={handleSaveItem} className="bg-white neo-card p-6 space-y-4">
              <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading font-bold text-xs uppercase mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. TRUFFLE MONSTER"
                    className="w-full neo-border rounded-xl px-4 py-2 bg-[#FFF5F0] font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full neo-border rounded-xl px-4 py-2 bg-[#FFF5F0] font-heading font-bold text-xs uppercase"
                  >
                    <option value="PIZZA">PIZZA</option>
                    <option value="Sides">Sides</option>
                    <option value="DRINKS">DRINKS</option>
                    <option value="DESSERTS">DESSERTS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full neo-border rounded-xl px-4 py-2 bg-[#FFF5F0] font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase mb-1">Availability</label>
                  <select
                    value={form.isAvailable ? 'true' : 'false'}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.value === 'true' })}
                    className="w-full neo-border rounded-xl px-4 py-2 bg-[#FFF5F0] font-heading font-bold text-xs uppercase"
                  >
                    <option value="true">Available</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="neo-btn py-3 px-6 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase rounded-xl"
              >
                SAVE ITEM ✓
              </button>
            </form>
          )}

          {/* Inventory Table Card */}
          <div className="bg-white neo-card p-6 space-y-4">
            <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase border-b-2 border-[#1E1E1E] pb-3">
              Current Menu Items ({items.length})
            </h3>

            {loading ? (
              <div className="text-center py-6 font-bold text-xs">Loading menu items...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#1E1E1E] text-xs font-heading font-black uppercase text-gray-500">
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock Qty</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-gray-100 text-xs font-extrabold">
                    {items.map((item) => {
                      const stockQty = item.stock !== undefined ? item.stock : 50;
                      const isLowStock = stockQty < 5;

                      return (
                        <tr key={item._id} className={`hover:bg-[#FFF5F0] ${isLowStock ? 'bg-amber-50/60' : ''}`}>
                          <td className="py-4 px-4 font-heading font-black text-sm uppercase text-[#1E1E1E]">
                            {item.name}
                          </td>
                          <td className="py-4 px-4 text-gray-500 uppercase">{item.category}</td>
                          <td className="py-4 px-4 font-heading font-black text-sm text-[#FF6B35]">
                            ${(item.basePrice || 0).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 font-heading font-bold text-xs">
                            <span className={isLowStock ? 'text-red-600 font-black underline' : 'text-emerald-700'}>
                              {stockQty} units
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <StickerBadge
                              text={
                                isLowStock
                                  ? `LOW STOCK (${stockQty}) ⚠️`
                                  : item.isAvailable !== false
                                    ? 'IN STOCK'
                                    : 'OUT OF STOCK 🛑'
                              }
                              variant={isLowStock ? 'pink' : item.isAvailable !== false ? 'lime' : 'dark'}
                              size="sm"
                            />
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            {isLowStock && (
                              <button
                                onClick={() => handleRestockStock(item._id, item.name, stockQty)}
                                className="neo-btn py-1.5 px-3 bg-[#CCFF00] text-[#1E1E1E] font-heading font-extrabold text-[11px] uppercase rounded-lg cursor-pointer"
                              >
                                Restock 📦
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleAvailability(item._id, item.isAvailable !== false)}
                              className="neo-btn py-1.5 px-3 bg-white text-[#1E1E1E] font-heading font-extrabold text-[11px] uppercase rounded-lg cursor-pointer"
                            >
                              Toggle Stock 🔄
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(item._id);
                                setForm({
                                  name: item.name,
                                  category: item.category || 'PIZZA',
                                  price: item.basePrice || 0,
                                  sizes: item.sizes || ['Small'],
                                  toppings: item.toppings || ['Cheese'],
                                  isAvailable: item.isAvailable !== false,
                                });
                                setShowAddForm(true);
                              }}
                              className="neo-btn py-1.5 px-3 bg-[#CCFF00] text-[#1E1E1E] font-heading font-extrabold text-[11px] uppercase rounded-lg cursor-pointer"
                            >
                              Edit ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="neo-btn py-1.5 px-3 bg-red-500 text-white font-heading font-extrabold text-[11px] uppercase rounded-lg cursor-pointer"
                            >
                              Delete ❌
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
