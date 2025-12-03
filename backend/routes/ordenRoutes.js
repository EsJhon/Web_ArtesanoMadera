import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// 1️⃣ REGISTRAR UNA ORDEN
router.post('/', async (req, res) => {
  const { usuario_id, total, items } = req.body;

  // Validación básica
  if (!usuario_id) {
    return res.status(401).json({ error: "Debes iniciar sesión para realizar la compra" });
  }
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" });
  }

  try {
    // Validar stock de cada producto antes de crear la orden
    for (const item of items) {
      const [rows] = await db.query("SELECT stock FROM productos WHERE id = ?", [item.id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: `Producto con ID ${item.id} no encontrado` });
      }
      if (rows[0].stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${item.nombre || 'el producto'} (Disponible: ${rows[0].stock})` });
      }
    }

    // Crear orden principal
    const [orderResult] = await db.query(
      "INSERT INTO ordenes (usuario_id, total, estado) VALUES (?, ?, 'pendiente')",
      [usuario_id, total]
    );
    const orden_id = orderResult.insertId;

    // Insertar detalles de la orden y restar stock
    for (const item of items) {
      const subtotal = item.precio * item.cantidad;

      await db.query(
        "INSERT INTO orden_detalles (orden_id, producto_id, cantidad, subtotal) VALUES (?, ?, ?, ?)",
        [orden_id, item.id, item.cantidad, subtotal]
      );

      await db.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [item.cantidad, item.id]
      );
    }

    res.json({ message: "Orden registrada correctamente", orden_id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar orden", details: err });
  }
});

// OBTENER TODAS LAS ÓRDENES
router.get('/', async (req, res) => {
  try {
    const [ordenes] = await db.query("SELECT * FROM ordenes");
    res.json(ordenes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener órdenes", details: err });
  }
});

// ACTUALIZAR ESTADO DE UNA ORDEN
router.put('/estado/:id', async (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  try {
    await db.query("UPDATE ordenes SET estado=? WHERE id=?", [estado, id]);
    res.json({ message: "Estado actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar estado", details: err });
  }
});

// DASHBOARD
router.get('/dashboard', async (req, res) => {
  try {
    const [[ventas]] = await db.query(`SELECT SUM(total) AS totalVentas FROM ordenes`);

    const [[topProd]] = await db.query(`
      SELECT p.nombre, SUM(od.cantidad) AS vendidos
      FROM orden_detalles od
      JOIN productos p ON p.id = od.producto_id
      GROUP BY producto_id
      ORDER BY vendidos DESC
      LIMIT 1
    `);

    const [[clientes]] = await db.query(`SELECT COUNT(*) AS totalClientes FROM usuarios`);

    const [[pendientes]] = await db.query(`
      SELECT COUNT(*) AS pedidosPendientes FROM ordenes WHERE estado='pendiente'
    `);

    res.json({
      totalVentas: ventas.totalVentas ?? 0,
      productoTop: topProd?.nombre ?? "—",
      totalClientes: clientes.totalClientes,
      pedidosPendientes: pendientes.pedidosPendientes
    });

  } catch (err) {
    res.status(500).json({ error: "Error en dashboard", details: err });
  }
});

export default router;
