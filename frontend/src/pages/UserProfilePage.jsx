import React, { useState, useEffect } from 'react';
import PageShell from '../components/PageShell.jsx';
import StickerBadge from '../components/StickerBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import addressService from '../services/addressService.js';

/**
 * Page 7: User Profile Page
 */
export default function UserProfilePage({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [name, setName] = useState(user?.username || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'alex@lizza.com');
  const [phone, setPhone] = useState('+1 (512) 555-0199');
  const [spicePreference, setSpicePreference] = useState('Hot Honey / Medium Spicy');

  const [addresses, setAddresses] = useState([]);
  const [loadingAddr, setLoadingAddr] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    async function loadUserAddresses() {
      if (!user?._id) return;
      try {
        setLoadingAddr(true);
        const data = await addressService.getAddresses(user._id);
        setAddresses(Array.isArray(data) ? data : data.addresses || []);
      } catch (err) {
        console.warn('Error fetching addresses:', err);
      } finally {
        setLoadingAddr(false);
      }
    }
    loadUserAddresses();
  }, [user]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullAddress: '',
    city: '',
    pincode: '',
    phone: '',
    isDefault: true,
  });

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    try {
      const res = await addressService.addAddress(user._id, newAddr);
      const added = res.address || res.newAddress || res;
      setAddresses((prev) => [...prev, added]);
      setActionMsg('New address added successfully! ✅');
      setShowAddModal(false);
      setNewAddr({ fullAddress: '', city: '', pincode: '', phone: '', isDefault: false });
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Failed to add address.');
    }
  };

  const handleMarkDefault = async (addressId) => {
    try {
      await addressService.setDefault(addressId);
      setActionMsg('Address set as default!');
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a._id === addressId }))
      );
    } catch (err) {
      setActionMsg('Failed to mark default address.');
    }
  };

  return (
    <PageShell activeTab="profile" onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* User Hero Banner */}
        <div className="bg-white neo-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 bg-[#FF2E93] text-white rounded-3xl font-black text-4xl flex items-center justify-center neo-border neo-shadow-sm rotate-[-3deg]">
              ⚡
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1E1E1E] uppercase">
                  {name}
                </h1>
                <StickerBadge text={user?.role === 'admin' ? 'ADMIN SQUAD 👑' : 'PIZZA LEGEND 🏆'} variant="lime" size="sm" />
              </div>
              <p className="text-xs font-bold text-gray-500">{email} • Squad Member since 2024</p>
            </div>
          </div>

          {/* Squad Points Widget */}
          <div className="bg-[#FFF5F0] neo-border p-4 rounded-2xl text-center space-y-1 w-full md:w-auto">
            <span className="text-[10px] font-heading font-extrabold uppercase text-gray-500 tracking-wider">
              SQUAD REWARD POINTS
            </span>
            <div className="font-heading font-black text-3xl text-[#FF6B35]">
              420 <span className="text-sm text-[#1E1E1E]">PTS</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg neo-border">
              🎁 80 pts to Free Large Pizza
            </div>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3 bg-emerald-100 neo-border border-emerald-500 text-emerald-800 font-bold text-xs rounded-xl text-center">
            {actionMsg}
          </div>
        )}

        {/* Tab Switchers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'info', label: 'Personal Info 👤' },
            { id: 'addresses', label: 'Addresses 📍' },
            { id: 'payment', label: 'Payments 💳' },
            { id: 'vibes', label: 'Flavor Vibes 🌶️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 rounded-2xl font-heading font-extrabold text-xs uppercase tracking-wider neo-border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FF6B35] text-white neo-shadow rotate-[-1deg]'
                  : 'bg-white text-[#1E1E1E] hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="bg-white neo-card p-6 space-y-6">
          
          {activeTab === 'info' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                Edit Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-[#1E1E1E] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full neo-border rounded-xl px-4 py-3 bg-[#FFF5F0] font-medium text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-[#1E1E1E] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full neo-border rounded-xl px-4 py-3 bg-[#FFF5F0] font-medium text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-[#1E1E1E] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full neo-border rounded-xl px-4 py-3 bg-[#FFF5F0] font-medium text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold text-xs uppercase text-[#1E1E1E] mb-1">
                    Flavor Profile
                  </label>
                  <input
                    type="text"
                    value={spicePreference}
                    onChange={(e) => setSpicePreference(e.target.value)}
                    className="w-full neo-border rounded-xl px-4 py-3 bg-[#FFF5F0] font-medium text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button className="neo-btn py-3 px-6 bg-[#CCFF00] text-[#1E1E1E] font-heading font-black text-xs uppercase rounded-xl cursor-pointer">
                Save Changes ✓
              </button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                  Saved Delivery Addresses
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(!showAddModal)}
                  className="neo-btn px-4 py-2 bg-[#CCFF00] text-[#1E1E1E] font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
                >
                  {showAddModal ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {showAddModal && (
                <form onSubmit={handleAddAddress} className="p-4 bg-[#FFF5F0] neo-border rounded-2xl space-y-3">
                  <h4 className="font-heading font-black text-sm uppercase">Add New Delivery Address</h4>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Street Address (e.g. 123 Main St, Apt 4B)"
                      value={newAddr.fullAddress}
                      onChange={(e) => setNewAddr({ ...newAddr, fullAddress: e.target.value })}
                      className="w-full neo-border rounded-xl px-3 py-2 text-xs font-medium bg-white mb-2"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="neo-border rounded-xl px-3 py-2 text-xs font-medium bg-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Pincode / Zip"
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        className="neo-border rounded-xl px-3 py-2 text-xs font-medium bg-white"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Phone Number"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="w-full neo-border rounded-xl px-3 py-2 text-xs font-medium bg-white mb-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full neo-btn py-2.5 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase rounded-xl"
                  >
                    SAVE ADDRESS 📍
                  </button>
                </form>
              )}

              {loadingAddr ? (
                <div className="text-xs font-bold">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="p-4 bg-[#FFF5F0] neo-border rounded-2xl text-xs font-bold text-gray-600">
                  No saved addresses found on your account yet. Add one above or during checkout!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="bg-[#FFF5F0] neo-border p-4 rounded-2xl space-y-2 relative">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h4 className="font-heading font-extrabold text-sm uppercase">{addr.city || 'Address'} HQ 🏠</h4>
                        {addr.isDefault ? (
                          <StickerBadge text="DEFAULT" variant="pink" size="sm" />
                        ) : (
                          <button
                            onClick={() => handleMarkDefault(addr._id)}
                            className="text-xs font-bold text-[#FF6B35] underline cursor-pointer"
                          >
                            Mark Default
                          </button>
                        )}
                      </div>
                      <p className="text-xs font-medium text-gray-600">{addr.fullAddress}</p>
                      <p className="text-[11px] font-bold text-gray-500">Pincode: {addr.pincode} • Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                Saved Payment Cards
              </h3>
              <div className="p-4 bg-[#1E1E1E] text-white neo-border rounded-2xl max-w-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-black text-lg">VISA</span>
                  <span className="text-xs text-[#CCFF00] font-bold">PRIMARY</span>
                </div>
                <div className="font-mono tracking-widest text-base">•••• •••• •••• 4242</div>
                <div className="flex justify-between text-xs font-bold text-gray-400">
                  <span>EXPIRES: 12/28</span>
                  <span>{name}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vibes' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                Dietary & Spice Settings
              </h3>
              <div className="space-y-3">
                {['Vegetarian Only', 'Extra Spicy AF', 'Gluten-Friendly Dough', 'Hot Honey Addict'].map((vibe, idx) => (
                  <label key={idx} className="flex items-center gap-3 bg-[#FFF5F0] neo-border p-3 rounded-xl cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-[#FF6B35]" defaultChecked={idx === 1 || idx === 3} />
                    <span className="font-heading font-extrabold text-xs uppercase text-[#1E1E1E]">{vibe}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </PageShell>
  );
}
