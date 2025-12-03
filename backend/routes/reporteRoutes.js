import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// DASHBOARD
router.get('/dashboard', async (req, res) => {
  try {
    const [[clientes]] = await db.query("SELECT COUNT(*) AS totalClientes FROM usuarios");

    const [[pedidos]] = await db.query(
      "SELECT COUNT(*) AS pedidosPendientes FROM ordenes WHERE estado='pendiente'"
    );

    const [[ventas]] = await db.query(
      "SELECT SUM(total) AS totalVentas FROM ordenes"
    );

    res.json({
      totalVentas: ventas.totalVentas || 0,
      totalClientes: clientes.totalClientes || 0,
      pedidosPendientes: pedidos.pedidosPendientes || 0,
      productoTop: "N/A"
    });

  } catch (err) {
    res.status(500).json({ error: "Error en dashboard", details: err });
  }
});

// REPORTE DE VENTAS POR MES
router.get('/ventas', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT MONTH(created_at) AS mes, SUM(total) AS total
      FROM ordenes
      GROUP BY MONTH(created_at)
    `);

    res.json({
      labels: result.map(r => "Mes " + r.mes),
      values: result.map(r => r.total)
    });

  } catch (err) {
    res.status(500).json({ error: "Error al obtener ventas", details: err });
  }
});

export default router;
