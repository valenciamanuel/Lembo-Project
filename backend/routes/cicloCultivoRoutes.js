const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ✅ SOLUCIÓN: Usamos el nombre exacto de tu archivo controlador (con guion bajo)
const { 
    insertarCicloCultivo, 
    obtenerCiclosCultivo, 
    obtenerCicloPorId, 
    actualizarCicloCultivo, 
    toggleCicloEstado 
} = require('../controllers/ciclo_cultivoController.js'); 

// --- Configuración de Multer para manejar la subida de imágenes ---

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Asumiendo la estructura: backend/routes/ -> ../../fronted/public/uploads
        cb(null, path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único
        cb(null, 'ciclo-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- Definición de Rutas ---

// GET /ciclocultivo: Obtener todos los ciclos
router.get('/', obtenerCiclosCultivo);

// POST /ciclocultivo: Insertar nuevo ciclo (con imagen)
router.post('/', upload.single('image'), insertarCicloCultivo);

// GET /ciclocultivo/:id: Obtener un solo ciclo
router.get('/:id', obtenerCicloPorId);

// PUT /ciclocultivo/:id: Actualizar un ciclo (con posible nueva imagen)
router.put('/:id', upload.single('image'), actualizarCicloCultivo); 

// PUT /ciclocultivo/:id/estado: Cambiar el estado
router.put('/:id/estado', toggleCicloEstado);

module.exports = router;