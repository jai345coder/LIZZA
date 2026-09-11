import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        item: { type: mongoose.Schema.Types.Mixed, required: true },
        name: { type: String },
        size: { type: String },
        crust: { type: String },
        sauce: { type: String },
        cheese: { type: String },
        toppings: [{ type: String }],
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    razorpayOrderId: { type: String, default: null },

    paymentId: {
        type: String,
        default: null
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    estimatedDeliveryTime: {
        type: Date
    }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;