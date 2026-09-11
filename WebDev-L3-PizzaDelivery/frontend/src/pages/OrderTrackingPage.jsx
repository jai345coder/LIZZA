import React, { useState, useEffect } from 'react';
import PageShell from '../components/PageShell.jsx';
import StickerBadge from '../components/StickerBadge.jsx';
import { useOrder } from '../context/OrderContext.jsx';
import orderService from '../services/orderService.js';
import { 
  connectSocket, 
  joinOrderRoom, 
  leaveOrderRoom, 
  onOrderStatusUpdated 
} from '../services/socketServies.js';

/**
 * Page 5: Order Tracking Page
 */
export default function OrderTrackingPage({ onNavigate }) {
  const { currentOrder } = useOrder();
  const [liveOrder, setLiveOrder] = useState(currentOrder);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const orderId = currentOrder?._id || currentOrder?.id;
    if (!orderId) return;

    // 1. Establish Socket connection
    connectSocket();

    // 2. Join room for this specific order
    joinOrderRoom(orderId);

    // 3. Listen for real-time status updates emitted by backend
    onOrderStatusUpdated((data) => {
      if (String(data.orderId) === String(orderId)) {
        console.log("⚡ Real-time status update received:", data.status);
        setLiveOrder((prev) => ({
          ...prev,
          status: data.status,
          updatedAt: data.updatedAt || new Date().toISOString()
        }));
      }
    });

    // 4. Leave room on component unmount
    return () => {
      leaveOrderRoom(orderId);
    };
  }, [currentOrder]);

  const getStageFromStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'received':
      case 'pending':
        return 1;
      case 'preparing':
      case 'cooking':
        return 3;
      case 'out-for-delivery':
      case 'out_for_delivery':
        return 4;
      case 'delivered':
      case 'completed':
        return 5;
      default:
        return 3;
    }
  };

  const currentStage = getStageFromStatus(liveOrder?.status);
// const orderStimulator = ()
  const trackingSteps = [
    { stage: 1, title: 'Order Placed', time: 'Received', desc: 'Sent to Kitchen HQ', icon: '📝' },
    { stage: 2, title: 'Dough Prepped', time: 'In Progress', desc: 'Hand-tossed with 100% chaos', icon: '👨‍🍳' },
    { stage: 3, title: 'In the Oven', time: 'Baking', desc: 'Baking at 850°F woodfire heat', icon: '🔥' },
    { stage: 4, title: 'Out for Delivery', time: 'En Route', desc: 'Driver is zooming to your pad', icon: '🛵' },
    { stage: 5, title: 'Delivered', time: 'Final Stage', desc: 'Hot & ready to devour', icon: '🍕' },
  ];

  return (
    <PageShell activeTab="track" onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Status Header */}
        <div className="bg-white neo-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-2xl text-[#1E1E1E]">
                ORDER #{liveOrder?._id?.substring(0, 8) || '4092'}
              </span>
              <StickerBadge text={liveOrder?.status?.toUpperCase() || 'LIVE TRACKING ⚡'} variant="lime" rotate="left" size="sm" />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase">
              Placed on {new Date(liveOrder?.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Total: ${liveOrder?.totalAmount || '24.99'}
            </p>
          </div>

          <div className="bg-[#FF6B35] text-white p-4 rounded-2xl neo-border neo-shadow-sm text-center">
            <div className="text-[10px] font-heading font-extrabold uppercase tracking-widest opacity-90">
              STATUS
            </div>
            <div className="font-heading font-black text-2xl tracking-tight mt-0.5 animate-pulse uppercase">
              {liveOrder?.status || 'PREPARING'}
            </div>
          </div>
        </div>

        {/* Live Map Preview Mock */}
        <div className="bg-[#1E1E1E] neo-card p-6 text-white relative overflow-hidden min-h-64 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#CCFF00] text-[#1E1E1E] rounded-2xl font-black text-2xl flex items-center justify-center neo-border">
                🛵
              </div>
              <div>
                <div className="font-heading font-extrabold text-base uppercase">Marco (Courier)</div>
                <div className="text-xs font-medium text-gray-300">Red Vespa • 4.9★ Rating</div>
              </div>
            </div>

            <button className="neo-btn py-2 px-4 bg-[#FF2E93] text-white font-heading font-extrabold text-xs uppercase rounded-xl cursor-pointer">
              📞 Call Driver
            </button>
          </div>

          {/* Map Graphic Overlay */}
          <div className="my-6 p-4 bg-[#2A2A2A] neo-border rounded-2xl flex items-center justify-between text-xs font-bold">
            <span>📍 Kitchen HQ</span>
            <div className="flex-1 mx-4 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-[#CCFF00] w-3/4 animate-pulse" />
            </div>
            <span>🏠 Your House</span>
          </div>

          <div className="text-center text-xs font-heading font-bold text-[#CCFF00] uppercase tracking-wider z-10">
            "Marco is en route with your fresh pizza!"
          </div>
        </div>

        {/* Step Timeline */}
        <div className="bg-white neo-card p-6 space-y-6">
          <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
            Order Progress Timeline ⏳
          </h3>

          <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-1 before:bg-gray-200">
            {trackingSteps.map((step) => {
              const isCurrent = step.stage === currentStage;
              const isPast = step.stage <= currentStage;

              return (
                <div key={step.stage} className="flex items-start gap-4 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-xl neo-border font-black text-lg flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-[#FF6B35] text-white neo-shadow scale-110'
                        : isPast
                        ? 'bg-[#CCFF00] text-[#1E1E1E]'
                        : 'bg-white text-gray-400'
                    }`}
                  >
                    {step.icon}
                  </div>

                  <div className="flex-1 bg-[#FFF5F0] p-4 neo-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-black text-base text-[#1E1E1E] uppercase">
                          {step.title}
                        </h4>
                        {isCurrent && <StickerBadge text="IN PROGRESS" variant="pink" size="sm" />}
                      </div>
                      <p className="text-xs font-medium text-gray-600 mt-0.5">{step.desc}</p>
                    </div>

                    <span className="font-heading font-bold text-xs text-gray-500 whitespace-nowrap">
                      {step.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => onNavigate && onNavigate('menu')}
              className="neo-btn py-3 px-6 bg-[#1E1E1E] text-white font-heading font-black text-xs uppercase tracking-widest rounded-xl cursor-pointer"
            >
              ← Return to Menu
            </button>
          </div>
        </div>

      </div>
    </PageShell>
  );
}
