import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar.jsx';
import StickerBadge from '../components/StickerBadge.jsx';
import orderService from '../services/orderService.js';
import { connectSocket, joinAdminRoom, onNewOrderPlaced, onOrderStatusUpdated } from '../services/socketServies.js';

/**
 * Page 10: Admin Order Management Page (Kitchen HQ)
 */
export default function AdminOrderManagementPage({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlinePaused, setOnlinePaused] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const loadAdminOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.adminGetAllOrders();
      const list = Array.isArray(data) ? data : data.orders || [];
      setOrders(list);
      console.log("🟢 FETCHED ORDERS :" , list);
    } catch (err) {
      console.warn('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminOrders();

    // Connect to WebSocket & join admin room for live notifications
    connectSocket();
    joinAdminRoom();

    onNewOrderPlaced((data) => {
      console.log("⚡ New Order Placed Alert Received!", data);
      setActionMsg("🍕 New order received!");
      loadAdminOrders();
    });

    onOrderStatusUpdated((data) => {
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          String(ord._id) === String(data.orderId) ? { ...ord, status: data.status } : ord
        )
      );
    });

    const interval = setInterval(loadAdminOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id, currentStatus) => {
    let nextStatus = 'preparing';
    if (currentStatus?.toLowerCase() === 'pending' || currentStatus?.toLowerCase() === 'received') {
      nextStatus = 'preparing';
    } else if (currentStatus?.toLowerCase() === 'preparing') {
      nextStatus = 'out-for-delivery';
    } else if (currentStatus?.toLowerCase() === 'out-for-delivery') {
      nextStatus = 'delivered';
    } else {
      nextStatus = 'delivered';
    }

    try {
      await orderService.updateOrderStatus(id, nextStatus);
      setActionMsg(`Order #${id.substring(0, 6)} status updated to ${nextStatus}!`);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: nextStatus } : o))
      );
    } catch (err) {
      setActionMsg('Failed to update order status.');
    }
  };



  /** @logics just for cheks */
  console.log(orders.length);


  return (
    <div className="min-h-screen w-full bg-[#FFF5F0] flex flex-col lg:flex-row text-[#1E1E1E] overflow-y-auto">
      {/* Left Sidebar */}
      <AdminSidebar activeTab="admin-orders" onNavigate={onNavigate} />

      {/* Main Content Dashboard */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 bg-[radial-gradient(#1E1E1E_0.75px,transparent_0.75px)] [background-size:16px_16px]">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#1E1E1E] uppercase tracking-tight">
                KITCHEN HQ DASHBOARD
              </h1>
              <StickerBadge text="LIVE ORDERS" variant="lime" rotate="right" size="sm" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-600 mt-1">
              Manage incoming customer orders in real-time.
            </p>
          </div>

          <button
            onClick={loadAdminOrders}
            className="bg-white neo-border neo-shadow-sm px-4 py-2 rounded-2xl flex items-center gap-2 font-mono font-black text-xs uppercase cursor-pointer"
          >
            🔄 Refresh Live Feed
          </button>
        </div>

        {actionMsg && (
          <div className="p-3 bg-emerald-100 neo-border border-emerald-500 text-emerald-800 font-bold text-xs rounded-xl">
            {actionMsg}
          </div>
        )}

        {/* Top 3 Stat Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Active Kitchen Orders (Excludes delivered and cancelled) */}
          <div className="bg-[#FF6B35] text-black neo-card p-5 relative overflow-hidden flex flex-col justify-between min-h-36">
            <div className="flex items-center justify-between font-heading font-extrabold text-xs uppercase tracking-wider">
              <span>ACTIVE KITCHEN ORDERS</span>
              <span className="text-xl">🍕</span>
            </div>
            <div className="flex items-baseline gap-3 my-2">
              <span className="font-heading font-black text-4xl sm:text-5xl">
                {orders.filter((o) => !['delivered', 'cancelled'].includes(o.status?.toLowerCase()?.trim())).length}
              </span>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-lg">
                In Queue: {orders.filter((o) => ['pending', 'confirmed'].includes(o.status?.toLowerCase()?.trim())).length}
              </span>
            </div>
          </div>

          {/* Card 2: Preparing / Cooking */}
          <div className="bg-[#CCFF00] text-[#1E1E1E] neo-card p-5 relative overflow-hidden flex flex-col justify-between min-h-36">
            <div className="flex items-center justify-between font-heading font-extrabold text-xs uppercase tracking-wider">
              <span>PREPARING / COOKING</span>
              <span className="text-xl">🔥</span>
            </div>
            <div className="flex items-baseline gap-3 my-2">
              <span className="font-heading font-black text-4xl sm:text-5xl">
                {orders.filter((o) => ['preparing', 'cooking', 'in-kitchen', 'in_kitchen'].includes(o.status?.toLowerCase()?.trim())).length}
              </span>
            </div>
          </div>

          {/* Card 3: Out For Delivery */}
          <div className="bg-[#FF2E93] text-black neo-card p-5 relative overflow-hidden flex flex-col justify-between min-h-36">
            <div className="flex items-center justify-between font-heading font-extrabold text-xs uppercase tracking-wider">
              <span>OUT FOR DELIVERY</span>
              <span className="text-xl">🛵</span>
            </div>
            <div className="flex items-baseline gap-3 my-2">
              <span className="font-heading font-black text-4xl sm:text-5xl">
                {orders.filter((o) => ['out-for-delivery', 'out_for_delivery', 'sent-to-delivery'].includes(o.status?.toLowerCase()?.trim())).length}
              </span>
            </div>
          </div>
        </div>

        {/* Incoming Orders Section */}
        <div className="bg-orange-200 rounded-[20px] neo-card  p-6  space-y-4">
          <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase border-b-2  border-[#1E1E1E] pb-3">
            Kitchen Queue ({orders.length})
          </h3>

          {loading ? (
            <div className="text-center py-6 font-bold text-xs">Loading kitchen queue...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-bold text-sm">
              No customer orders in queue right now.
            </div>
          ) : (
            <div className="space-y-4 ">
              {orders.map((ord) => {
                // Extract User ID & Customer Info
                const userId = ord.user?._id || (typeof ord.user === 'string' ? ord.user : 'GUEST-USER');
                const customerInfo = ord.user?.name || ord.user?.username || ord.user?.email || 
                  (ord.deliveryAddress?.phone ? `Customer (Ph: ${ord.deliveryAddress.phone})` : 'Guest Customer');

                const addressLabel = ord.deliveryAddress?.label ? `[${ord.deliveryAddress.label.toUpperCase()}] ` : '';
                const addressStr = ord.deliveryAddress
                  ? `${addressLabel}${ord.deliveryAddress.fullAddress || ''}, ${ord.deliveryAddress.city || ''} - ${ord.deliveryAddress.pincode || ''} (Ph: ${ord.deliveryAddress.phone || 'N/A'})`
                  : 'Address Not Specified';

                const formattedDate = ord.createdAt 
                  ? new Date(ord.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                  : '';

                return (
                  <div key={ord._id} className="bg-white  p-3.5 sm:p-4 bg-[#FFF5F0] neo-border border-2 border-[#1E1E1E] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Left Info Section */}
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Row 1: Order ID, Status Badge, Payment Badge, Timestamp */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-gray-600 bg-white neo-border px-2 py-0.5 rounded-md">
                          #{ord._id}
                        </span>
                        <StickerBadge
                          text={ord.status?.toUpperCase() || 'PENDING'}
                          variant={
                            ord.status === 'preparing'
                              ? 'orange'
                              : ord.status === 'out-for-delivery'
                              ? 'lime'
                              : ord.status === 'delivered'
                              ? 'yellow'
                              : ord.status === 'cancelled'
                              ? 'dark'
                              : 'pink'
                          }
                          size="sm"
                        />
                        {ord.paymentStatus && (
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md neo-border ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-300 text-emerald-900' : 'bg-amber-200 text-amber-900'
                          }`}>
                            💳 {ord.paymentStatus}
                          </span>
                        )}
                        {formattedDate && (
                          <span className="text-[11px] font-medium text-gray-500">
                            🕒 {formattedDate}
                          </span>
                        )}
                      </div>

                      {/* Row 2: USER ID (BIG FONT) + Customer Name */}
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">USER ID:</span>
                        <span className="font-mono font-black text-lg sm:text-xl text-[#FF2E93] bg-white neo-border px-2 py-0.5 rounded-md break-all">
                          {userId}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          👤 {customerInfo} {ord.user?.email ? `(${ord.user.email})` : ''}
                        </span>
                      </div>

                      {/* Row 3: ORDERED ITEMS (BIG FONT) */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">ITEMS:</div>
                        <div className="flex flex-wrap gap-2">
                          {ord.items && ord.items.length > 0 ? (
                            ord.items.map((i, idx) => {
                              const itemName = i.item?.name || i.name || 'Pizza Item';
                              const toppingsArr = Array.isArray(i.toppings) 
                                ? i.toppings.map(t => typeof t === 'string' ? t : t.name).filter(Boolean) 
                                : [];
                              return (
                                <div key={idx} className="bg-white neo-border px-2.5 py-1 rounded-lg flex items-center gap-2">
                                  <span className="font-heading font-black text-base sm:text-lg text-[#1E1E1E]">
                                    🍕 {itemName}
                                  </span>
                                  <span className="bg-[#CCFF00] text-[#1E1E1E] text-xs font-mono font-black px-1.5 py-0.5 rounded border border-black">
                                    x{i.quantity || 1}
                                  </span>
                                  {(i.size || toppingsArr.length > 0) && (
                                    <span className="text-[11px] font-normal text-gray-500">
                                      ({[i.size, toppingsArr.length > 0 ? `Toppings: ${toppingsArr.join(', ')}` : null].filter(Boolean).join(' | ')})
                                    </span>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <span className="font-heading font-black text-base text-[#1E1E1E]">🍕 1x Pizza Item</span>
                          )}
                        </div>
                      </div>

                      {/* Row 4: Delivery Address & Payment ID (Regular Font) */}
                      <div className="text-xs font-medium text-gray-600 space-y-0.5 pt-0.5 border-t border-gray-200/80">
                        <p><strong className="text-gray-800">Address:</strong> {addressStr}</p>
                        {ord.paymentId && <p className="font-mono text-[11px]"><strong>Payment ID:</strong> {ord.paymentId}</p>}
                      </div>
                    </div>

                    {/* Right Action & Total Section */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 border-t md:border-t-0 border-gray-200 pt-2 md:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Total</span>
                        <span className="font-heading font-black text-lg text-[#FF6B35]">
                          ${(ord.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={ord.status || 'pending'}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            orderService.updateOrderStatus(ord._id, newStatus).then(() => {
                              setActionMsg(`Order #${ord._id?.substring(0, 6)} updated to ${newStatus}`);
                              loadAdminOrders();
                            });
                          }}
                          className="bg-white neo-border font-heading font-black text-xs uppercase px-2.5 py-1.5 rounded-lg cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing 🔥</option>
                          <option value="out-for-delivery">Out For Delivery 🛵</option>
                          <option value="delivered">Delivered ✅</option>
                          <option value="cancelled">Cancelled ❌</option>
                        </select>

                        <button
                          onClick={() => handleUpdateStatus(ord._id, ord.status)}
                          className="neo-btn py-1.5 px-3 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase rounded-lg cursor-pointer hover:bg-[#ff5a22]"
                        >
                          Advance →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
