import React, { useState, useEffect } from 'react';
import PageShell from '../components/PageShell.jsx';
import StickerBadge from '../components/StickerBadge.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useOrder } from '../context/OrderContext.jsx';
import addressService from '../services/addressService.js';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Page 4: Order Summary / Checkout Page
 */
export default function OrderSummaryPage({ onNavigate }) {
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart, estimatedTotal } = useCart();
  const { placeNewOrder, createPaymentOrder, verifyPayment, setCurrentOrder } = useOrder();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    fullAddress: '',
    city: '',
    pincode: '',
    phone: '',
    isDefault: true,
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(true);
  const [deliveryNote, setDeliveryNote] = useState('Leave at front porch, ring bell 🔔');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch addresses on mount
  useEffect(() => {
    async function fetchAddresses() {
      if (!user?._id) return;
      try {
        const data = await addressService.getAddresses(user._id);
        const list = Array.isArray(data) ? data : data.addresses || [];
        setAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr._id);
        }
      } catch (err) {
        console.warn('Failed to load user addresses:', err);
      }
    }
    fetchAddresses();
  }, [user]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    try {
      const res = await addressService.addAddress(user._id, newAddressForm);
      const added = res.address || res;
      setAddresses((prev) => [...prev, added]);
      setSelectedAddressId(added._id);
      setShowAddAddress(false);
      setNewAddressForm({ fullAddress: '', city: '', pincode: '', phone: '', isDefault: false });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add address');
    }
  };

  const deliveryFee = 2.99;
  const discount = promoApplied ? 5.00 : 0;
  const tax = estimatedTotal * 0.08;
  const grandTotal = Math.max(0, estimatedTotal + deliveryFee + tax - discount);

  const handlePlaceOrderAndPay = async () => {
    setErrorMsg('');
    if (!selectedAddressId && addresses.length > 0) {
      setErrorMsg('Please select a delivery address');
      return;
    }

    setIsProcessing(true);
    try {
      if (!selectedAddressId && addresses.length === 0) {
        setErrorMsg('Please add a delivery address below before placing your order.');
        setShowAddAddress(true);
        setIsProcessing(false);
        return;
      }

      const targetAddressId = selectedAddressId || addresses[0]?._id;
      if (!targetAddressId) {
        setErrorMsg('Please select or add a valid delivery address.');
        setIsProcessing(false);
        return;
      }

      const itemsToOrder = cartItems.map((ci) => ({
        item: ci._id || ci.itemId,
        size: ci.size || 'M',
        toppings: Array.isArray(ci.toppings) ? ci.toppings : [],
        quantity: ci.quantity || 1,
        price: ci.price || ci.unitPrice || 0,
      }));

      if (itemsToOrder.length === 0) {
        setErrorMsg('Your cart is empty! Add some delicious items first.');
        setIsProcessing(false);
        return;
      }

      // 1. Place order on backend
      const order = await placeNewOrder(targetAddressId, itemsToOrder, grandTotal);
      const orderId = order._id || order.id;

      // 2. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setCurrentOrder(order);
        clearCart();
        if (onNavigate) onNavigate('track');
        return;
      }

      // 3. Create Razorpay Payment Order
      const rzpData = await createPaymentOrder(orderId);

      const options = {
        key: rzpData.key || rzpData.razorpayKeyId || 'rzp_test_key',
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: 'LIZZA PIZZA CO.',
        description: `Order #${orderId}`,
        order_id: rzpData.razorpayOrderId || rzpData.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              orderId,
            });
            clearCart();
            if (onNavigate) onNavigate('track');
          } catch (verErr) {
            console.error('Payment verification failed:', verErr);
            clearCart();
            if (onNavigate) onNavigate('track');
          }
        },
        prefill: {
          name: user?.username || 'Pizza Fan',
          email: user?.email || 'user@lizza.com',
        },
        theme: {
          color: '#FF6B35',
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (err) {
      console.error('Order placement error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageShell activeTab="summary" onNavigate={onNavigate}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 neo-card">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading font-black text-3xl text-[#1E1E1E] uppercase tracking-tight">
                ORDER SUMMARY 🛍️
              </h1>
              <StickerBadge text="CHECKOUT" variant="lime" rotate="left" size="sm" />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase">
              Review your items and lock in delivery address
            </p>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('menu')}
            className="neo-btn py-2 px-4 bg-white text-[#1E1E1E] font-heading font-bold text-xs uppercase rounded-xl cursor-pointer"
          >
            + Add More Slices
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-100 neo-border border-red-500 text-red-700 font-bold text-sm rounded-2xl">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Main Details (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Cart Items List */}
            <div className="bg-white neo-card p-5 space-y-4">
              <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                Your Selected Crusts ({cartItems.length})
              </h3>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500 font-bold text-sm">
                  Your cart is empty! <button onClick={() => onNavigate('menu')} className="text-[#FF6B35] underline cursor-pointer">Browse Menu</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FFF5F0] neo-border rounded-2xl gap-3"
                    >
                      <div>
                        <h4 className="font-heading font-extrabold text-base text-[#1E1E1E] uppercase">
                          {item.name}
                        </h4>
                        <p className="text-xs font-bold text-gray-500">{item.size || 'Regular'}</p>
                        <p className="text-sm font-extrabold text-[#FF6B35] mt-1">
                          ${((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white neo-border p-1 rounded-xl w-fit">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 font-black text-sm flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-heading font-black text-sm px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white font-black text-sm flex items-center justify-center hover:bg-[#ff5a22] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Address & Note */}
            <div className="bg-white neo-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                  Delivery Details 📍
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="neo-btn py-1 px-3 bg-[#CCFF00] text-[#1E1E1E] font-heading font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                >
                  {showAddAddress ? 'Cancel' : '+ New Address'}
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="p-4 bg-[#FFF5F0] neo-border rounded-2xl space-y-3">
                  <h4 className="font-heading font-black text-sm uppercase">Add New Address</h4>
                  <input
                    type="text"
                    required
                    placeholder="Full Address (e.g. 742 Evergreen Terrace)"
                    value={newAddressForm.fullAddress}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, fullAddress: e.target.value })}
                    className="w-full neo-border rounded-xl px-3 py-2 bg-white text-xs font-bold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddressForm.city}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                      className="w-full neo-border rounded-xl px-3 py-2 bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Pincode"
                      value={newAddressForm.pincode}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                      className="w-full neo-border rounded-xl px-3 py-2 bg-white text-xs font-bold"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Phone Number"
                    value={newAddressForm.phone}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                    className="w-full neo-border rounded-xl px-3 py-2 bg-white text-xs font-bold"
                  />
                  <button
                    type="submit"
                    className="w-full neo-btn py-2 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase rounded-xl"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {addresses.length === 0 ? (
                <div className="p-4 bg-[#CCFF00]/30 neo-border rounded-2xl space-y-1">
                  <span className="font-heading font-extrabold text-sm uppercase">Default Demo Address</span>
                  <p className="font-bold text-sm text-[#1E1E1E]">742 Evergreen Terrace, Sector 4</p>
                  <p className="text-xs font-medium text-gray-600">Austin, TX 78701 • (512) 555-0199</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 neo-border rounded-2xl cursor-pointer transition-all ${
                        selectedAddressId === addr._id ? 'bg-[#CCFF00]/40 neo-shadow' : 'bg-[#FFF5F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-extrabold text-sm uppercase">{addr.city}</span>
                        {addr.isDefault && <StickerBadge text="DEFAULT" variant="dark" size="sm" />}
                      </div>
                      <p className="font-bold text-sm text-[#1E1E1E]">{addr.fullAddress}</p>
                      <p className="text-xs font-medium text-gray-600">Pincode: {addr.pincode} • Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block font-heading font-bold text-xs uppercase tracking-wider text-[#1E1E1E] mb-1">
                  Delivery Driver Instructions
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Call upon arrival"
                  className="w-full neo-border rounded-xl px-4 py-3 bg-[#FFF5F0] font-medium text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Price Breakdown & Order Trigger (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Promo Code Input */}
            <div className="bg-white neo-card p-5 space-y-3">
              <h4 className="font-heading font-extrabold text-sm uppercase text-[#1E1E1E]">
                Have a Promo Code? 🏷️
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Try CHAOS25"
                  className="flex-1 neo-border rounded-xl px-3 py-2.5 bg-[#FFF5F0] font-heading font-bold text-xs uppercase focus:outline-none"
                />
                <button
                  onClick={() => setPromoApplied(true)}
                  className="neo-btn py-2.5 px-4 bg-[#CCFF00] text-[#1E1E1E] font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 bg-emerald-50 p-2 neo-border rounded-lg">
                  <span>✓ Code CHAOS25 Applied ($5.00 OFF)</span>
                  <button onClick={() => setPromoApplied(false)} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              )}
            </div>

            {/* Bill Receipt Card */}
            <div className="bg-white neo-card p-5 space-y-4">
              <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase border-b-2 border-[#1E1E1E] pb-2">
                Payment Breakdown
              </h3>

              <div className="space-y-2 text-sm font-bold text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${estimatedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Gen Z Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t-2.5 border-[#1E1E1E] pt-3 flex justify-between items-center font-heading font-black text-2xl text-[#1E1E1E]">
                <span>TOTAL</span>
                <span className="text-[#FF6B35]">${grandTotal.toFixed(2)}</span>
              </div>

              {/* Confirm CTA */}
              <button
                onClick={handlePlaceOrderAndPay}
                disabled={isProcessing}
                className="w-full neo-btn py-4 px-6 bg-[#FF6B35] hover:bg-[#ff5a22] text-white font-heading font-black text-base uppercase tracking-widest rounded-2xl cursor-pointer text-center disabled:opacity-50"
              >
                {isProcessing ? 'PROCESSING PAYMENT...' : 'PLACE ORDER & PAY (RAZORPAY) 💳'}
              </button>
            </div>

          </div>

        </div>
      </div>
    </PageShell>
  );
}
