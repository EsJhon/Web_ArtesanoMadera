import { db } from '../db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurar dónde se guardarán las imágenes
// Configurar almacenamiento dinámico
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Obtener categoría y subcategoría del body
    const categoria = req.body.categoria || 'otros';
    const subcategoria = req.body.subcategoria || 'general';

    const dir = `uploads/productos/${subcategoria}`;

    // Crear carpeta si no existe
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Guardar con el nombre original
    cb(null, file.originalname);
  }
});

export const upload = multer({ storage });

// 🔹 Obtener productos
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Agregar producto con imagen
// 🔹 Agregar producto con imagen
export const addProduct = async (req, res) => {
  try {
    const { nombre, categoria, subcategoria, precio, descripcion, stock } = req.body;

    let imagenPath = null;
    if (req.file) {
      // Guardar solo la ruta relativa dentro de uploads/productos
      imagenPath = `${subcategoria}/${req.file.originalname}`; // sillas/silla_03.jpg
    }

    const [result] = await db.query(
      'INSERT INTO productos (nombre, categoria, subcategoria, precio, descripcion, stock, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, categoria, subcategoria, precio, descripcion, stock, imagenPath]
    );

    res.json({
      message: 'Producto agregado',
      id: result.insertId,
      imagen: imagenPath
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Error al agregar producto');
  }
};

// 🔹 Editar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria, subcategoria } = req.body;

    let imagenPath = null;
    if (req.file) {
      imagenPath = `${subcategoria}/${req.file.originalname}`; // ruta relativa
    }

    let query = `
      UPDATE productos 
      SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, subcategoria=?
    `;
    let values = [nombre, descripcion, precio, stock, categoria, subcategoria];

    if (imagenPath) {
      query += `, imagen=?`;
      values.push(imagenPath);
    }

    query += ` WHERE id=?`;
    values.push(id);

    await db.execute(query, values);

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('DELETE FROM productos WHERE id=?', [id]);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
