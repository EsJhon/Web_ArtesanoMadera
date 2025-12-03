import express from 'express';
import { getCart, addCartItem, updateCartItem, removeCartItem } from '../controllers/carritoController.js';

const router = express.Router();

router.get('/:usuarioId', getCart);
router.post('/', addCartItem);
router.put('/:carritoId', updateCartItem);
router.delete('/:carritoId', removeCartItem);

export default router;
