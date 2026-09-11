import { createContext, useContext, useState } from "react";
import orderService from "../services/orderService.js";
import paymentService from "../services/paymentService.js";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const placeNewOrder = async (addressId, items, totalAmount) => {
    setIsLoading(true);
    try {
      const res = await orderService.placeOrder(addressId, { items, totalAmount });
      const order = res.order || res;
      setCurrentOrder(order);
      return order;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getUserOrders();
      const orders = Array.isArray(data) ? data : data.orders || [];
      setOrderHistory(orders);
      return orders;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderById = async (orderId) => {
    setIsLoading(true);
    try {
      const res = await orderService.getOrderById(orderId);
      const order = res.order || res;
      setCurrentOrder(order);
      return order;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setIsLoading(true);
    try {
      const res = await orderService.cancelOrder(orderId);
      const updated = res.order || res;
      setOrderHistory((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
      if (currentOrder?._id === orderId) {
        setCurrentOrder((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
      }
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const createPaymentOrder = async (orderId) => {
    return await paymentService.createPaymentOrder(orderId);
  };

  const verifyPayment = async (paymentDetails) => {
    return await paymentService.verifyPayment(paymentDetails);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orderHistory,
        isLoading,
        placeNewOrder,
        fetchUserOrders,
        fetchOrderById,
        cancelOrder,
        createPaymentOrder,
        verifyPayment,
        setCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}

export default OrderContext;