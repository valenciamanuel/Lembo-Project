const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { insertarCultivo, obtenerCultivos, obtenerCultivoPorId, actualizarCultivo } = require('../controllers/cultivoController.js');

// --- Configuración de Multer para manejar la subida de imágenes ---

// 1. Configurar el almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // ✅ CORRECCIÓN CLAVE: Ruta ajustada para guardar en 'fronted/public/uploads'
        cb(null, path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único para evitar colisiones
        cb(null, 'cultivo-' + Date.now() + path.extname(file.originalname));
    }
});

// 2. Crear la instancia de Multer. El campo 'image' debe coincidir con el 'name' del input del HTML.
const upload = multer({ storage: storage });

// --- Definición de Rutas ---

// GET /cultivo: Obtener todos los cultivos (para Visualizar Cultivos)
router.get('/', obtenerCultivos);

// POST /cultivo: Crea un nuevo cultivo (usa upload.single('image') para procesar el archivo)
router.post('/', upload.single('image'), insertarCultivo);


// GET /cultivo/:id: Obtener un solo cultivo
router.get('/:id', obtenerCultivoPorId);

// PUT /cultivo/:id: Actualizar un cultivo
router.put('/:id', actualizarCultivo);

module.exports = router;
