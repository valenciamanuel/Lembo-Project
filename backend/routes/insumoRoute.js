// routes/insumoRoute.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.js'); // pool mysql2/promise

// Obtener todos los insumos
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM insumo');
    return res.json(results);
  } catch (err) {
    console.error('Error al obtener insumos:', err);
    return res.status(500).json({ error: 'Error al obtener insumos' });
  }
});

// Insertar un insumo (image opcional, se envía como string/URL/base64)
router.post('/', async (req, res) => {
  try {
    const {
      tipoInsumo,
      nombreInsumo,
      unidadMedida,
      cantidad,
      valorUnitario,
      valorTotal,
      descripcion,
      estado,
      image // opcional
    } = req.body;

    // Validación mínima
    if (
      !tipoInsumo ||
      !nombreInsumo ||
      !unidadMedida ||
      cantidad == null ||
      valorUnitario == null ||
      valorTotal == null ||
      !descripcion ||
      !estado
    ) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios (image opcional)' });
    }

    const sql = `
      INSERT INTO insumo
      (tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      tipoInsumo,
      nombreInsumo,
      unidadMedida,
      cantidad,
      valorUnitario,
      valorTotal,
      descripcion,
      estado,
      image || null
    ];

    const [result] = await db.query(sql, values);

    return res.status(201).json({
      idInsumo: result.insertId,
      tipoInsumo,
      nombreInsumo,
      unidadMedida,
      cantidad,
      valorUnitario,
      valorTotal,
      descripcion,
      estado,
      image: image || null
    });
  } catch (err) {
    console.error('Error al insertar el insumo:', err);
    return res.status(500).json({ error: 'Error al insertar el insumo' });
  }
});

module.exports = router;
