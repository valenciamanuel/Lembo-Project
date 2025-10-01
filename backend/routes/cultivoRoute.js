const express = require('express');
const router = express.Router();
const {
  upload,
  insertarCultivo,
  obtenerCultivos,
  obtenerCultivoPorId,
  actualizarCultivo
} = require('../controllers/cultivoController');

router.post('/', upload.single('image'), insertarCultivo);
router.get('/', obtenerCultivos);
router.get('/:id', obtenerCultivoPorId);
router.put('/:id', upload.single('image'), actualizarCultivo);

module.exports = router;
