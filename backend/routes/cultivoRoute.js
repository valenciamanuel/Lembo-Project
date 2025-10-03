const express = require('express');
const router = express.Router();
const {
  upload,
  insertarCultivo,
  obtenerCultivos,
  obtenerCultivoPorId,
  actualizarCultivo
} = require('../controllers/cultivoController');
const { protect } = require('../middleware/authMiddleware');
const { eliminarCultivo } = require('../controllers/cultivoController');

router.post('/', upload.single('image'), insertarCultivo);
router.get('/', obtenerCultivos);
router.get('/:id', obtenerCultivoPorId);
router.put('/:id', upload.single('image'), actualizarCultivo);
router.delete('/:id', protect, eliminarCultivo);

module.exports = router;
