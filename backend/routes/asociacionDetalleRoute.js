// routes/asociacionDetalleRoute.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 

// Ruta para obtener los detalles de una asociación
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID no proporcionado' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM asociaciones WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Asociación no encontrada' });
    }

    // Devuelve los datos como JSON (para consumir en visualizar_asociacion.html)
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la asociación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
