import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/authRoutes.js';
import productoRoutes from './routes/productoRoutes.js';

import usuarioRoutes from './routes/usuarioRoutes.js';
import ordenRoutes from './routes/ordenRoutes.js';
import reporteRoutes from './routes/reporteRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/reportes', reporteRoutes);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
