import { Router } from 'express';
import { addToCart, getCart, removeFromCart, updateCartQuantity } from '../controllers/cart.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Protected routes - require authentication
router.use(verifyJWT);

router.post('/add', addToCart);
router.get('/', getCart);
router.delete('/remove', removeFromCart);
router.patch('/update', updateCartQuantity);

export default router;