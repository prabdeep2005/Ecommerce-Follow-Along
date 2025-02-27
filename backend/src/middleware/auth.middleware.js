import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // Get token from cookies or authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized request"
        });
    }

    try {
        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Get user from database
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token"
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Access Token"
        });
    }
});

// Verify seller middleware
export const verifySeller = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Only sellers can access this resource"
        });
    }
    next();
});