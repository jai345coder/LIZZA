import React, { useState, useEffect } from 'react';
import PageShell from '../components/PageShell.jsx';
import StickerBadge from '../components/StickerBadge.jsx';
import { useOrder } from '../context/OrderContext.jsx';
import { connectSocket, onOrderStatusUpdated } from '../services/socketServies.js';

/**
 * Page 6: Order History Page
 */
export default function OrderHistoryPage({ onNavigate }) {
  const { fetchUserOrders, cancelOrder, setCurrentOrder } = useOrder();
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await fetchUserOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Error fetching user order history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();

    connectSocket();
    onOrderStatusUpdated((data) => {
      setOrders((prev) =>
        prev.map((o) => (String(o._id) === String(data.orderId) ? { ...o, status: data.status } : o))
      );
    });
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: 'cancelled' } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (filter === 'live') return ['pending', 'preparing', 'out-for-delivery'].includes(ord.status?.toLowerCase());
    if (filter === 'completed') return ord.status?.toLowerCase() === 'delivered';
    return true;
  });

  return (
    <PageShell activeTab="history" onNavigate={onNavigate}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 neo-card">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading font-black text-3xl text-[#1E1E1E] uppercase tracking-tight">
                ORDER HISTORY 📜
              </h1>
              <StickerBadge text="SQUAD VAULT" variant="yellow" rotate="right" size="sm" />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase">
              Review your past chaotic pizza runs and instant reorder
            </p>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('builder')}
            className="neo-btn py-2.5 px-4 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
          >
            + Create New Crust
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'live', label: 'Live Orders ⚡' },
            { id: 'completed', label: 'Completed' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`py-2 px-4 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider neo-border transition-all cursor-pointer whitespace-nowrap ${
                filter === f.id
                  ? 'bg-[#CCFF00] text-[#1E1E1E] neo-shadow rotate-[-1deg]'
                  : 'bg-white text-[#1E1E1E] hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-8 font-heading font-black text-[#1E1E1E]">
            LOADING ORDER HISTORY... 🍕
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white neo-card p-8 text-center space-y-3">
            <h3 className="font-heading font-black text-xl">NO ORDERS FOUND</h3>
            <p className="text-xs font-bold text-gray-500">You haven't placed any orders matching this filter yet.</p>
            <button
              onClick={() => onNavigate('menu')}
              className="neo-btn py-2.5 px-4 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
            >
              Browse Menu Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const isLive = ['pending', 'preparing', 'out-for-delivery'].includes(ord.status?.toLowerCase());
              return (
                <div
                  key={ord._id}
                  className="bg-white neo-card p-5 space-y-4 hover:neo-shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1E1E1E] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-black text-2xl text-[#1E1E1E]">
                        #{ord._id?.substring(0, 8)}
                      </span>
                      <StickerBadge
                        text={ord.status?.toUpperCase() || 'PENDING'}
                        variant={isLive ? 'lime' : 'dark'}
                        size="sm"
                      />
                    </div>
                    <span className="font-heading font-bold text-xs text-gray-500">
                      {new Date(ord.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Items Summary */}
                  <div className="bg-[#FFF5F0] neo-border p-4 rounded-2xl space-y-2">
                    <div className="text-xs font-heading font-black uppercase text-gray-500 tracking-wider">
                      Items Ordered ({ord.items?.length || 0}):
                    </div>
                    <ul className="space-y-2">
                      {ord.items?.map((item, idx) => (
                        <li key={idx} className="bg-white neo-border p-3 rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 font-heading font-black text-sm sm:text-xl text-[#1E1E1E]">
                          <div className="flex items-center gap-2">
                            <span className="text-[#FF6B35]">🍕</span>
                            <span>{item.name || item.item?.name || 'Pizza Item'}</span>
                          </div>
                          <span className="bg-[#CCFF00] text-[#1E1E1E] text-sm px-2.5 py-0.5 rounded-lg font-mono font-black border border-black">
                            x{item.quantity || 1}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Total & Action Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase block">Total Paid</span>
                      <span className="font-heading font-black text-2xl text-[#FF6B35]">
                        ${(ord.totalAmount || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                      {isLive && (
                        <button
                          onClick={() => {
                            setCurrentOrder(ord);
                            if (onNavigate) onNavigate('track');
                          }}
                          className="w-full sm:w-auto neo-btn py-2.5 px-4 bg-[#CCFF00] text-[#1E1E1E] font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
                        >
                          Track Live 🛵
                        </button>
                      )}

                      {ord.status?.toLowerCase() !== 'cancelled' && ord.status?.toLowerCase() !== 'delivered' && (
                        <button
                          onClick={() => handleCancelOrder(ord._id)}
                          disabled={cancellingId === ord._id}
                          className="w-full sm:w-auto neo-btn py-2.5 px-4 bg-red-500 text-white font-heading font-black text-xs uppercase rounded-xl cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === ord._id ? 'CANCELING...' : 'Cancel Order ❌'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </PageShell>
  );
}
