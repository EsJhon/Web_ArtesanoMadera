import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js'; // Tu conexión a la base de datos
import dotenv from 'dotenv';
dotenv.config();

/** Registro de usuario */
export const registerUser = async (req, res) => {
  const { nombre, email, telefono, direccion, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Faltan datos' });
  }

  try {
    // Verificar si el correo ya existe
    const [existing] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Correo ya registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en DB
    await db.query(
      'INSERT INTO usuarios (nombre, email, telefono, direccion, password) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, telefono, direccion, hashedPassword]
    );

    res.json({ status: 'success', message: 'Usuario registrado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Faltan datos' });
  }

  try {
    // Buscar usuario por email
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // 🔹 Solo permitir admin (ID 8)
    if (user.id !== 8) {
      return res.status(403).json({ status: 'error', message: 'Solo el usuario admin puede iniciar sesión' });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Contraseña incorrecta' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ status: 'success', token, message: 'Login exitoso', user: { id: user.id, nombre: user.nombre, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
};

