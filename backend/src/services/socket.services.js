import { Server, Socket } from "socket.io";

let io;//Hold reference to the io instance
//function Initialize Socket.io and setup event Listener

export const initSocket = (httpServer)=>{
      io = new Server(httpServer,{
            cors:{
                  origin:"http://localhost:5173",
                  methods:["GET" , "POST"]
            }
      });

      io.on("connection",(socket)=>{
            console.log("🟢 User connected :", socket.id);


            //When customer opens order tracking page
            socket.on("join_order_room" ,(orderId)=>{
                  socket.join(`order_${orderId}`);
                  console.log(`📦 Socket ${socket.id} joined room: order_${orderId}`);
            });


            //when customer leaves order room
            socket.on("leave_order_room",(orderId)=>{
                  socket.leave(`order_${orderId}`);
                  console.log(`🚪 Socket ${socket.id} left room: order_${orderId}`);
            });



            //Admin joins the global admin notification room
            socket.on("join_admin_room", ()=>{
                  socket.join("admin_room");
                  console.log(`👑 Socket ${socket.id} joined admin_room`);
            });


            socket.on("disconnect",()=>{
                  console.log("❌ User Disconnected:", socket.id);
            });
      });


      return io;
}


// Function 2: Export getIO so controllers (e.g., order.controller.js) can use it anywhere!

export const getIO=()=>{
      if(!io){
            throw new Error("Socket.io not intialized");
      }

      return io;
}



























