import { asyncHandler } from '../utils/asyncHandler.js';
import { Product } from '../models/product.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category } = req.body;

    // Validation checks
    if ([name, description, price, category].some(field => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    if (isNaN(price) || price < 0) {
        throw new ApiError(400, "Price must be a valid positive number");
    }

    const validCategories = ["Electronics", "Wearables", "Accessories"];
    if (!validCategories.includes(category)) {
        throw new ApiError(400, "Invalid product category");
    }

    // Image validation
    const imageFiles = req.files;
    if (!imageFiles?.length || imageFiles.length > 5) {
        throw new ApiError(400, "Please provide 1-5 product images");
    }

    try {
        // Upload images
        const uploadPromises = imageFiles.map(file => uploadOnCloudinary(file.path));
        const uploadedImages = await Promise.all(uploadPromises);

        // Check if any uploads failed
        if (uploadedImages.some(img => !img)) {
            throw new ApiError(500, "Failed to upload one or more images");
        }

        // Create product
        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category,
            images: uploadedImages,
            seller: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        // Log the actual error for debugging
        console.error("Product creation error:", error);
        throw new ApiError(
            500, 
            error.message || "Error creating product"
        );
    }
});

// Get all products with filters and pagination
const getAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, minPrice, maxPrice, sort } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortOptions = {};
    if (sort) {
        const [field, order] = sort.split(':');
        sortOptions[field] = order === 'desc' ? -1 : 1;
    }

    const products = await Product.find(filter)
        .populate('seller', 'name email')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);
    
    return res.status(200).json({
        success: true,
        data: {
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        }
    });
});

// Get single product
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('seller', 'name email');
    
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json({
        success: true,
        data: product
    });
});


// Update product
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Verify seller ownership
    if (product.seller.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this product");
    }

    const updateData = { ...req.body };

    // Handle new images if provided
    if (req.files?.length) {
        try {
            const uploadedImages = await Promise.all(
                req.files.map(async (file) => {
                    const result = await uploadOnCloudinary(file.path);
                    if (!result || !result.public_id || !result.url) {
                        throw new ApiError(500, "Image upload failed");
                    }
                    return {
                        public_id: result.public_id,
                        url: result.url
                    };
                })
            );

            // Only update images if all uploads were successful
            updateData.images = uploadedImages;
        } catch (error) {
            throw new ApiError(500, "Error uploading images");
        }
    } else {
        // If no new images, remove images field from update
        delete updateData.images;
    }

    // Validate price if provided
    if (updateData.price && (isNaN(updateData.price) || updateData.price < 0)) {
        throw new ApiError(400, "Price must be a valid positive number");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { 
            new: true, 
            runValidators: true,
            context: 'query' 
        }
    ).populate('seller', 'name email');

    if (!updatedProduct) {
        throw new ApiError(404, "Product update failed");
    }

    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct
    });
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Verify seller ownership
    if (product.seller.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this product");
    }

    // Delete images from Cloudinary
    try {
        await Promise.all(
            product.images.map(async (image) => {
                // TODO: Implement Cloudinary image deletion
                // await cloudinary.uploader.destroy(image.public_id);
            })
        );
    } catch (error) {
        throw new ApiError(500, "Error deleting product images");
    }

    await product.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};