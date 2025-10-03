const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); // Configuración de Multer
console.log('🔀 insumoRoute loaded');
const {
  insertarInsumo,
  obtenerInsumos,
  obtenerInsumoPorId,
  actualizarInsumo
} = require('../controllers/insumoController.js');
const { eliminarInsumo } = require('../controllers/insumoController.js');
const { protect } = require('../middleware/authMiddleware');

// Crear insumo con imagen
router.post('/', upload.single('image'), insertarInsumo);

// Obtener todos los insumos
router.get('/', obtenerInsumos);

// Obtener insumo por ID
router.get('/:id', obtenerInsumoPorId);

// Actualizar insumo y su imagen si se carga una nueva
router.put('/:id', upload.single('image'), actualizarInsumo);

// Eliminar (soft-delete) insumo — protegido
router.delete('/:id', protect, eliminarInsumo);

module.exports = router;
