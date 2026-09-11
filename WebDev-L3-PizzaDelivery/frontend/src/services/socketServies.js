import { io } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000";

let socket;

export const connectSocket = () => {
      if (!socket) {
            socket = io(SOCKET_URL, {
                  transports: ["websocket", "polling"],
                  autoConnect: true,
            });

            socket.on("connect", () => {
                  console.log("🟢 Connected to Socket server:", socket.id);
            });

            socket.on("disconnect", () => {
                  console.log("🔴 Disconnected from Socket server");
            });
      }

      return socket;
};

// Customer Room Helpers
export const joinOrderRoom = (orderId) => {
      if (socket) socket.emit("join_order_room", orderId);
};

export const leaveOrderRoom = (orderId) => {
      if (socket) socket.emit("leave_order_room", orderId);
};

export const onOrderStatusUpdated = (callback) => {
      if (socket) {
            socket.on("order_status_updated", callback);
      }
};

// Admin Room Helpers
export const joinAdminRoom = () => {
      if (socket) socket.emit("join_admin_room");
};

export const onNewOrderPlaced = (callback) => {
      if (socket) {
            socket.on("new_order_placed", callback);
      }
};

export const disconnectSocket = () => {
      if (socket) {
            socket.disconnect();
            socket = null;
      }
};