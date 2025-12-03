import pool from '../db.js';

export const getCart = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT c.id as carrito_id, p.nombre, p.precio, p.imagen, c.cantidad
       FROM carrito c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = ?`, [usuarioId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addCartItem = async (req, res) => {
  const { usuario_id, producto_id, cantidad } = req.body;
  try {
    await pool.execute(
      `INSERT INTO carrito(usuario_id, producto_id, cantidad) VALUES (?, ?, ?)`,
      [usuario_id, producto_id, cantidad]
    );
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { carritoId } = req.params;
  const { cantidad } = req.body;
  try {
    await pool.execute(`UPDATE carrito SET cantidad = ? WHERE id = ?`, [cantidad, carritoId]);
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  const { carritoId } = req.params;
  try {
    await pool.execute(`DELETE FROM carrito WHERE id = ?`, [carritoId]);
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria, subcategoria } = req.body;

    const imagen = req.file ? req.file.filename : null;

    let query = `
      UPDATE productos 
      SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, subcategoria=?
    `;
    const params = [nombre, descripcion, precio, stock, categoria, subcategoria];

    if (imagen) {
      query += `, imagen=?`;
      params.push(imagen);
    }

    query += ` WHERE id=?`;
    params.push(id);

    await db.execute(query, params);

    res.json({ message: "Producto actualizado correctamente" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 🔹 Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('DELETE FROM productos WHERE id = ?', [id]);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
