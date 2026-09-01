import ItemModel from "../models/Item.model.js";
import OrderModel from "../models/Order.model.js";
import AddressModel from "../models/Address.model.js";
import mongoose from 'mongoose';
import { getIO } from "../services/socket.services.js";




/**
 * Places a new order.
 * 
 * @param {Object} req - The request object containing order details.
 * @param {Object} res - The response object used to send back the HTTP response.
 */

export async function placeOrder(req, res) {
      try {
            const userId = req.user._id || req.user.id;
            const addressID = req.params.addressId || req.params.id;

            // Removed totalAmount from destructuring — we calculate it ourselves below
            const { items, status, paymentStatus, paymentId, estimatedDeliveryTime } = req.body;

            let totalAmount = 0; // ✅ declared separately with `let`, since it needs reassignment

            for (var orderItem of items) {
                  const itemStr = String(orderItem.item || '');
                  const isCustomItem = itemStr.startsWith('custom-') || !mongoose.Types.ObjectId.isValid(itemStr);

                  if (isCustomItem) {
                        // Custom pizzas built on frontend
                        const calculatedPrice = typeof orderItem.price === 'number' ? orderItem.price : 0;
                        totalAmount += calculatedPrice * orderItem.quantity;
                        orderItem.price = calculatedPrice;
                        if (!orderItem.name) {
                              orderItem.name = `CUSTOM PIZZA (${orderItem.size || 'Custom'})`;
                        }
                  } else {
                        // Catalog inventory items
                        const inventoryItem = await ItemModel.findById(orderItem.item);

                        if (!inventoryItem) {
                              return res.status(404).json({
                                    message: `Item with id "${orderItem.item}" not found in inventory`
                              });
                        }

                        // 1. Block order if item is marked unavailable OR stock is below 5 OR stock is less than requested quantity
                        if (!inventoryItem.isAvailable || inventoryItem.stock < 5 || inventoryItem.stock < orderItem.quantity) {
                              return res.status(400).json({
                                    message: `Item "${inventoryItem.name}" is out of stock (Stock: ${inventoryItem.stock}). Minimum stock required is 5.`
                              });
                        }

                        // 2. Calculate remaining stock after this order
                        const newStock = inventoryItem.stock - orderItem.quantity;
                        const isStillAvailable = newStock >= 5; // Mark unavailable if stock drops below 5

                        // 3. Decrement stock & update isAvailable status in MongoDB
                        await ItemModel.updateOne(
                              { _id: orderItem.item },
                              {
                                    $inc: { stock: -orderItem.quantity },
                                    $set: { isAvailable: isStillAvailable }
                              }
                        );

                        // 4. Calculate price & accumulate total amount
                        const sizeInfo = inventoryItem.sizes ? inventoryItem.sizes.find(s => s.size === orderItem.size) : null;
                        var calculatedPrice = inventoryItem.basePrice + (sizeInfo ? sizeInfo.priceModifier : 0);
                        totalAmount += calculatedPrice * orderItem.quantity;

                        orderItem.price = calculatedPrice;
                        if (!orderItem.name) {
                              orderItem.name = inventoryItem.name;
                        }
                  }
            }

            const givenAddress = await AddressModel.findById(addressID);
            if (!givenAddress) {
                  return res.status(404).json({ message: "Address not found" });
            }

            const order = await OrderModel.create({
                  user: userId,
                  items,
                  deliveryAddress: givenAddress._id,
                  totalAmount, // now correctly the server-calculated value
                  status,
                  paymentStatus,
                  paymentId,
                  estimatedDeliveryTime
            });

            //EMIT A SOCKET EVENT : TO notify admin of the new order
            getIO().to("admin_room").emit("new_order_placed",{
                  order
            });

            return res.status(201).json({
                  message: "Order placed successfully",
                  order
            });
      } catch (error) {
            console.log("error :", error);
            return res.status(500).json({
                  message: "Issue on some Order"
            });
      }
}








/**
 * 
 * @param {*} req input {req.user._id}
 * @param {*} res  
 * @returns 
 */

export async function getALLOrder(req, res) {
      try {
            const userId = req.user.id;
            if (!userId) {
                  return res.status(400).json({
                        message: "You haven't placed any orders yet"
                  })
            }

            const order = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });

            return res.status(200).json({
                  message: "Orders fetched successfully",
                  data: order
            });
      } catch (error) {
            return res.status(500).json({
                  message: "Issue on fetching order"
            })
      }
}



/**
 * @param {input} order_ID 
 * @output returms @orderDATA
 */

export async function getOrder(req, res) {
      try {
            const orderID = req.params.id;
            const userID = req.user.id;
            const order = await OrderModel.findOne({ _id: orderID, user: userID });
            if (!order) {

                  return res.status(404).json({
                        message: "no such order was found"
                  })
            }

            return res.status(200).json({
                  message: "Order fetched successfully",
                  order
            })
      } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({
                  message: "some error detected"
            })
      }
}




/**
 * @cancelOrder - cancels an order, but only if it hasn't progressed 
 * too far in the delivery process (e.g., not allowed once it's 
 * out for delivery or already delivered). Also restores the stock 
 * that was decremented when the order was placed.
 * @param {*} req input {req.params.id, req.user.id}
 * @param {*} res
 * @returns
 */

export async function cancelOrder(req, res) {
      try {
            const orderID = req.params.id;
            const userId = req.user.id;

            const order = await OrderModel.findOne({ _id: orderID, user: userId });

            if (!order) {
                  return res.status(404).json({ message: "No such order was found" });
            }

            // Only allow cancellation while the order is still early-stage
            const nonCancellableStatuses = ["out-for-delivery", "delivered", "cancelled"];
            if (nonCancellableStatuses.includes(order.status)) {
                  return res.status(400).json({
                        message: `Order cannot be cancelled — current status is "${order.status}"`
                  });
            }

            // Restore stock for every item in the order, since it's no longer being fulfilled
            for (const orderItem of order.items) {
                  if (mongoose.Types.ObjectId.isValid(orderItem.item)) {
                        const restoredItem = await ItemModel.findByIdAndUpdate(
                              orderItem.item,
                              { $inc: { stock: orderItem.quantity } },
                              { returnDocument: 'after' }
                        );

                        if (restoredItem && restoredItem.stock >= 5 && !restoredItem.isAvailable) {
                              restoredItem.isAvailable = true;
                              await restoredItem.save();
                        }
                  }
            }

            order.status = "cancelled";
            await order.save();

            //EMIT A SOCKET EVENT TO UPDATE CUSTOMER AND ADMIN BOTH 
            getIO().to(`order_${orderID}`).to("admin_room").emit("order_status_updated",{
                  orderId:orderID,
                  status:"cancelled",
                  updatedAt:new Date()

            });

            return res.status(200).json({
                  message: "Order cancelled successfully",
                  order
            });
      } catch (err) {
            console.log("ERROR:", err);
            return res.status(500).json({ message: "Some error detected while cancelling order" });
      }
}




/**
 * 
 * @param {@} req @only admin can accces all orders from diff users
 * @param {*} res 
 * @returns 
 */
export async function adminGetAllOrders(req, res) {
      try {
            const orders = await OrderModel.find({})
                  .populate('user', 'name email username phone')
                  .populate('items.item', 'name basePrice img category')
                  .populate('deliveryAddress')
                  .sort({ createdAt: -1 });

            return res.status(200).json({
                  message: "All orders fetched successfully",
                  data: orders
            });
      } catch (error) {
            console.log("ERROR:", error);
            return res.status(500).json({ message: "Issue fetching orders" });
      }
}





/**
 * @updateOrderStatus - allows admin to update an order's status
 * (Order Received → In Kitchen → Sent to Delivery → Delivered)
 * @param {*} req - expects req.params.id (order ID) and req.body.status
 * @param {*} res
 * @access Private (admin only)
 */
export async function updateOrderStatus(req, res) {
      try {
            const orderID = req.params.id;
            const { status } = req.body;

            // Validate the incoming status against your schema's allowed values
            const validStatuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

            if (!validStatuses.includes(status)) {
                  return res.status(400).json({
                        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                  });
            }

            const updatedOrder = await OrderModel.findByIdAndUpdate(orderID, { status }, { returnDocument: 'after' });
            if (!updatedOrder) {
                  return res.status(404).json({ message: "Order not found" });
            }
            /**
             * Emit a @real_time_Web_Socket event to the customer & admin
             */
            getIO().to(`order_${orderID}`).to("admin_room").emit("order_status_updated", {
                  orderId: orderID,
                  status: updatedOrder.status,
                  updatedAt: updatedOrder.updatedAt
            });


            // updatedOrder.status = status;
            // await updatedOrder.save();

            return res.status(200).json({
                  message: "Order status updated successfully",
                  updatedOrder
            });
      } catch (error) {
            console.log("ERROR:", error);
            return res.status(500).json({ message: "Issue updating order status" });
      }
}