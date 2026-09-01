import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',//name of the users collection
        required: true
    },
    label: {
        type: String,
        default: 'home'
    },
    fullAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const AddressModel = mongoose.model('Address', addressSchema);
export default AddressModel;