import { asyncHandler } from '../utils/asyncHandler.js';
import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';

// Add product to cart
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    // Validate product ID and quantity
    if (!productId || !quantity || quantity < 1) {
        throw new ApiError(400, "Invalid product ID or quantity");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [{ product: productId, quantity }]
        });
    } else {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    }

    return res.status(200).json({
        success: true,
        message: "Product added to cart",
        data: cart
    });
});

// Get cart info
const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images');

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    return res.status(200).json({
        success: true,
        data: cart
    });
});

// Remove product from cart
const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
    } else {
        throw new ApiError(404, "Product not found in cart");
    }

    return res.status(200).json({
        success: true,
        message: "Product removed from cart",
        data: cart
    });
});

// Update product quantity in cart
const updateCartQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
        throw new ApiError(400, "Invalid product ID or quantity");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
    } else {
        throw new ApiError(404, "Product not found in cart");
    }

    return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: cart
    });
});

export {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity
};