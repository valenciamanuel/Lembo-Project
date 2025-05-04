const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Este debe estar usando mysql2/promise

// Ruta para listar todas las asociaciones
router.get('/', async (req, res) => {
  try {
    const [asociaciones] = await pool.query('SELECT * FROM asociaciones'); // SIN callback
    res.json(asociaciones);
  } catch (error) {
    console.error('Error al obtener asociaciones:', error);
    res.status(500).json({ error: 'Error al obtener asociaciones' });
  }
});

module.exports = router;
