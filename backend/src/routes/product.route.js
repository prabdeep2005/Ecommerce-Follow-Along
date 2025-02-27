import { Router } from 'express';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT, verifySeller } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes - anyone can access
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes - require authentication
router.use(verifyJWT);

// Seller-only routes - require seller role
router.post(
    '/create', 
    verifySeller, // Verify seller role
    upload.array('images', 5), // Allow up to 5 images
    createProduct
);

router.put(
    '/:id',
    verifySeller,
    upload.array('images', 5),
    updateProduct
);

router.delete(
    '/:id', 
    verifySeller,
    deleteProduct
);

export default router;