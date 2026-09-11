import express from "express" ;
import { cancelOrder, adminGetAllOrders,updateOrderStatus, getALLOrder, getOrder, placeOrder } from "../controllers/order.controller.js";
import { adminOnlyMiddleware } from "../middlewares/adminOnly.middleware.js";



export const orderRouter = express.Router();


/**
 * @route POST /api/orders/place
 * @description Place a new order.
 * @access Private (requires authentication)
 * @returns {Object} The created order.
 */
orderRouter.post("/place/:addressId", placeOrder);



/**
 * @get api/order/allOrders
 */
orderRouter.get("/allOrders" ,  getALLOrder)

/**
 * @GET api/order/getOrder/:@order_id
 */

orderRouter.get("/get-order/:id", getOrder);

/**
 * @DELETE api/order/cancelOrder/:@order_ID
 */

orderRouter.delete("/cancel-order/:id", cancelOrder);


/**
 * @GET api/orders/admin/all
 * @description Admin views ALL orders from every user
 * @access Private (admin only)
 */
orderRouter.get("/admin/all", adminOnlyMiddleware, adminGetAllOrders);




/**
 * @get /admin/:id/status
 */

orderRouter.put("/admin/:id/status", adminOnlyMiddleware, updateOrderStatus);
export default orderRouter;