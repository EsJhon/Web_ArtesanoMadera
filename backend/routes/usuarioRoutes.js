import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// OBTENER TODOS LOS USUARIOS
router.get('/', async (req, res) => {
  try {
    const [usuarios] = await db.query("SELECT * FROM usuarios");
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: err });
  }
});

// EDITAR USUARIO
router.put('/editar/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No se enviaron datos para actualizar" });
  }

  try {
    const [result] = await db.query(
      "UPDATE usuarios SET ? WHERE id = ?",
      [data, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario', details: err });
  }
});



// ELIMINAR USUARIO
router.delete('/eliminar/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario', details: err });
  }
});

export default router;
