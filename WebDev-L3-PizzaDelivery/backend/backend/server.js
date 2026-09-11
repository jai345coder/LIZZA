import dotenv from "dotenv";
import http from 'http';
import connectDB from "./src/config/database.js";
import app from "./src/app.js";
import { initCronJOBS } from "./src/services/cron.servies.js";
import { initSocket } from "./src/services/socket.services.js";



const server = http.createServer(app);

// Initialize WebSockets
initSocket(server);
dotenv.config();
connectDB().then(() => {
    console.log("||===================================================||");
    server.listen(3000, () => {
        console.log(`⚙️ Server & WebSockets running at port: 3000`);
        initCronJOBS(); // periodic checks
    });
}).catch((err) => {
    console.error("Database connection failed:", err);
    server.listen(3000, () => {
        console.log(`⚙️ Server & WebSockets running at port: 3000`);
        initCronJOBS();
    });
});
