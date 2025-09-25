const express = require('express');
const router = express.Router();
const { insertarCultivo, obtenerCultivos } = require('../controllers/cultivoController.js');

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ✅ CORRECCIÓN: Se añadió un '..' para subir un nivel y acceder correctamente a 'fronted'
    const uploadPath = path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads');
    console.log('✅ Multer está intentando guardar en:', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Usar el middleware de Multer en la ruta POST
// El nombre 'image' debe coincidir con el del campo de archivo en tu HTML y FormData
router.post('/', upload.single('image'), insertarCultivo);

router.get('/', obtenerCultivos);

router.get('/:id', obtenerCultivoPorId);
router.put('/:id', actualizarCultivo);

module.exports = router;