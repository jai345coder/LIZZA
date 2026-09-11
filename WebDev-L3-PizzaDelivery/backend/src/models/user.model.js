import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    verificationToken: {
        type: String,

    },
    verificationTokenExpires: {
        type: Date,
    },
    resetToken: {
        type: String,
    },
    resetTokenExpires: {
        type: Date,
    }
})

const userModel = mongoose.model("user", userSchema);
export default userModel;