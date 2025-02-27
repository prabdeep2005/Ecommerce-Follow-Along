import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessandRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token generation error:", error);
        throw new ApiError(500, "Error generating tokens");
    }
};

// Register User Handler
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Enhanced validation
        if ([name, email, password].some((field) => !field?.trim())) {
            throw new ApiError(400, 'All fields are required');
        }

        // Email format validation
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            throw new ApiError(400, 'Invalid email format');
        }

        // Password strength validation
        if (password.length < 6) {
            throw new ApiError(400, 'Password must be at least 6 characters');
        }

        // Check existing user
        const existedUser = await User.findOne({ email: email.toLowerCase() });
        if (existedUser) {
            throw new ApiError(409, 'User with email already exists');
        }

        // Handle avatar upload or use DiceBear
        let avatarUrl;
        if (req.file) {
            avatarUrl = await uploadOnCloudinary(req.file.path);
        }

        // Use DiceBear as fallback
        const defaultAvatar = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(name)}`;

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            avatar: {
                public_id: `user_${Date.now()}`,
                url: avatarUrl || defaultAvatar
            }
        });

        const createdUser = await User.findById(user._id)
            .select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "User registration failed");
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: createdUser
        });
    } catch (error) {
        console.error("Register user error:", error);
        throw error;
    }
});

// Login Handler
// Login Handler
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        console.log("Login attempt with email:", email);

        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.log("User not found for email:", email);
            throw new ApiError(401, "Invalid credentials");
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            console.log("Incorrect password for email:", email);
            throw new ApiError(401, "Invalid credentials");
        }

        const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        };
        
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "Logged in successfully",
                data: {
                    user: loggedInUser,
                    accessToken
                }
            });
    } catch (error) {
        console.error("Login user error:", error);
        throw error;
    }
});

// Change Password Handler
const changePassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!oldPassword || !newPassword) {
            throw new ApiError(400, "Old password and new password are required");
        }

        if (newPassword.length < 6) {
            throw new ApiError(400, "New password must be at least 6 characters");
        }

        const user = await User.findById(userId);
        
        // Verify old password
        const isPasswordValid = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordValid) {
            throw new ApiError(401, "Old password is incorrect");
        }

        // Update password
        user.password = newPassword;
        await user.save({ validateBeforeSave: true });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Change password error:", error);
        throw error;
    }
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Get current user error:", error);
        throw error;
    }
});

// Logout Handler
const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: { refreshToken: 1 }
            },
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                success: true,
                message: "Logged out successfully"
            });
    } catch (error) {
        console.error("Logout user error:", error);
        throw error;
    }
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;
        let addresses = req.body.addresses;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Handle avatar upload if file is present
        if (req.file) {
            const avatarResult = await uploadOnCloudinary(req.file.path);
            if (avatarResult) {
                user.avatar = {
                    public_id: avatarResult.public_id,
                    url: avatarResult.url
                };
            }
        }

        // Parse addresses if it's a string
        if (addresses && typeof addresses === 'string') {
            try {
                addresses = JSON.parse(addresses);
            } catch (error) {
                throw new ApiError(400, "Invalid address format");
            }
        }

        // Update user fields if provided
        if (name?.trim()) {
            user.name = name;
            // Only update avatar if using dicebear and no file was uploaded
            if (!req.file && user.avatar.url.includes('dicebear')) {
                user.avatar.url = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(name)}`;
            }
        }
        if (phoneNumber?.trim()) user.phoneNumber = phoneNumber;
        
        // Update addresses
        if (addresses && Array.isArray(addresses)) {
            addresses.forEach(addr => {
                if (!addr.country || !addr.city || !addr.address1 || !addr.zipCode) {
                    throw new ApiError(400, "Missing required address fields");
                }
            });
            user.addresses = addresses;
        }

        await user.save({ validateBeforeSave: true });

        const updatedUser = await User.findById(userId)
            .select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error("Update user profile error:", error);
        throw error;
    }
});

// Become Seller Handler
const becomeSeller = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Check if user is already a seller
        if (user.role === "seller") {
            throw new ApiError(400, "User is already a seller");
        }

        // Update user role to seller
        user.role = "seller";
        await user.save({ validateBeforeSave: true });

        const updatedUser = await User.findById(userId)
            .select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            message: "Successfully upgraded to seller account",
            data: updatedUser
        });
    } catch (error) {
        console.error("Become seller error:", error);
        throw error;
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    getCurrentUser,
    changePassword,
    becomeSeller
};