import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Importar rutas del backend
import authRoutes from './backend/routes/authRoutes.js';
import productoRoutes from './backend/routes/productoRoutes.js';
import usuarioRoutes from './backend/routes/usuarioRoutes.js';
import ordenRoutes from './backend/routes/ordenRoutes.js';
import reporteRoutes from './backend/routes/reporteRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir carpeta de uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

// ================= RUTAS API =================
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/reportes', reporteRoutes);

// ================= SERVIR ANGULAR =================
const angularDistPath = path.join(__dirname, 'dist/WEB_ArtesanoMadera');
app.use(express.static(angularDistPath));

// CORRECCIÓN: Ruta catch-all mejorada
// Primero manejar rutas API no encontradas
app.all('/api/*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta API no encontrada' });
});

// Luego servir Angular para todas las demás rutas
app.get('/*', (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});