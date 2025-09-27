// routes/insumoRoute.js
const express = require('express');
const router = express.Router();
const db = require('../config/db.js'); // pool mysql2/promise

// ✅ 1. Importar Multer (asumo que usaremos la misma configuración)
const upload = require('../config/multerConfig'); 
// ✅ 2. Importar el controlador de insumo (lo moveremos allí para limpiar la ruta)
const { insertarInsumo, obtenerInsumoPorId, actualizarInsumo } = require('../controllers/insumoController.js');


// ✅ 3. Insertar un insumo (image opcional)
// Usamos upload.single('image') como middleware
// NOTA: Es mejor mover la lógica de inserción al controlador.
router.post('/', upload.single('image'), insertarInsumo); // Ahora llama al controlador

// ✅ Obtener todos los insumos (Mantenemos la ruta de obtención simple aquí)
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM insumo');
        return res.json(results);
    } catch (err) {
        console.error('❌ Error al obtener insumos:', err);
        return res.status(500).json({ error: 'Error al obtener insumos' });
    }
});


// ✅ Obtener un insumo por ID
router.get('/:id', obtenerInsumoPorId);

// ✅ Actualizar un insumo (Agregamos Multer también)
router.put('/:id', upload.single('image'), actualizarInsumo);

module.exports = router;