const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { 
    insertarCicloCultivo, 
    obtenerCiclosCultivo, 
    obtenerCicloPorId, 
    actualizarCicloCultivo, 
    toggleCicloEstado 
} = require('../controllers/ciclo_cultivoController.js'); 

const { protect } = require('../middleware/authMiddleware');
const { eliminarCiclo } = require('../controllers/ciclo_cultivoController.js');

// --- Configuración de Multer para manejar la subida de imágenes ---

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Generar un nombre de archivo único
        cb(null, 'ciclo-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', obtenerCiclosCultivo);

router.post('/', upload.single('image'), insertarCicloCultivo);

router.get('/:id', obtenerCicloPorId);

router.put('/:id', upload.single('image'), actualizarCicloCultivo); 

router.put('/:id/estado', toggleCicloEstado);
router.delete('/:id', protect, eliminarCiclo);

module.exports = router;