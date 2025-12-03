import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { db } from './db.js'; // tu conexión MySQL
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================= MULTER PARA IMÁGENES =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ================= API LOGIN =================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ status: 'error', message: 'Faltan datos' });

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ status: 'error', message: 'Usuario no encontrado' });

    const user = rows[0];
    // Solo admin
    if (user.id !== 8) return res.status(403).json({ status: 'error', message: 'Solo admin puede ingresar' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: 'error', message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ status: 'success', token, user: { id: user.id, nombre: user.nombre, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error del servidor' });
  }
});

// ================= API PRODUCTOS =================
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
});

app.post('/api/productos', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, subcategoria } = req.body;
    const imagen = req.file ? req.file.filename : '';
    await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, subcategoria, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock, categoria, subcategoria, imagen]
    );
    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error al crear producto' });
  }
});

// ================= SERVIR ANGULAR =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajustar la ruta según tu carpeta dist (mayúsculas/minúsculas exactas)
app.use(express.static(path.join(__dirname, 'dist/WEB_ArtesanoMadera')));

// Cualquier otra ruta envía index.html (para Angular routing)
app.get('/:path(*)', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/web-artesano-madera/index.html'));
});

// ================= INICIAR SERVIDOR =================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
