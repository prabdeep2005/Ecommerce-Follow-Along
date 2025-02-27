import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password must be at least 6 characters"]
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    addresses: [{
        country: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        address1: {
            type: String,
            required: true
        },
        address2: String,
        zipCode: {
            type: String,
            required: true
        },
        addressType: {
            type: String,
            enum: ["Home", "Work", "Other"],
            default: "Home"
        }
    }],
    role: {
        type: String,
        enum: ["user", "seller"],
        default: "user"
    },
    avatar: {
        public_id: String,
        url: String
    },
}, { 
    timestamps: true 
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check password
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role
    }, process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};

export const User = mongoose.model('User', userSchema);
