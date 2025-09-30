// routes/insumoRoute.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.js');
const upload = require('../config/multerConfig');
const {
  insertarInsumo,
  obtenerInsumos,
  obtenerInsumoPorId,
  actualizarInsumo
} = require('../controllers/insumoController.js');

// Crear insumo (imagen opcional)
router.post('/', upload.single('image'), insertarInsumo);

// Obtener todos los insumos
router.get('/', obtenerInsumos);

// Obtener insumo por ID
router.get('/:id', obtenerInsumoPorId);

// Actualizar insumo (imagen opcional)
router.put('/:id', upload.single('image'), actualizarInsumo);

module.exports = router;
