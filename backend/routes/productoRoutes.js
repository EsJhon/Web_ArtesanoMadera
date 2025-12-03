
// routes/productoRoutes.js
import express from 'express';
import { 
  getProducts, 
  addProduct, 
  upload, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productoController.js';

const router = express.Router();

// ================= RUTAS =================

// OBTENER TODOS
router.get('/', getProducts);

// AGREGAR
router.post('/agregar', upload.single('imagen'), addProduct);

// EDITAR
router.put('/editar/:id', upload.single('imagen'), updateProduct);

// ELIMINAR
router.delete('/eliminar/:id', deleteProduct);

export default router;