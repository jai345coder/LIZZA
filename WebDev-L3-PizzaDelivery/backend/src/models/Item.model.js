import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['PIZZA', 'Sides', 'DRINKS', 'DESSERTS'],
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    sizes: [{
        size: { type: String, enum: ['S', 'M', 'L'] },
        priceModifier: { type: Number, default: 0 }
    }],
    toppings: [{
        name: { type: String }
        
    }],
    image: {
        type: String,
        default: ''
    },
    // In Item schema, add:
    stock: { type: Number, default: 50 },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const ItemModel = mongoose.model('Item', itemSchema);
export default ItemModel;