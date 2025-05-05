const express = require('express');
const router = express.Router();
const { insertarAsociacion } = require('../controllers/asociacionController');
const connection = require('../config/db.js'); // ✅ Asegúrate de importar la conexión

// Ruta para insertar una nueva asociación
router.post('/', insertarAsociacion);

// ✅ Ruta para actualizar una asociación
router.put('/asociaciones/:id', async (req, res) => {
    const id = req.params.id;
    const {
        nombre_asociacion,
        responsable,
        descripcion,
        inversion,
        meta,
        iniico_produccion,
        fin_produccion,
        cultivo,
        sensores,
        insumos,
        ciclo_cultivo
    } = req.body;

    try {
        await connection.query(
            `UPDATE asociaciones SET 
                nombre_asociacion = ?, 
                responsable = ?, 
                descripcion = ?, 
                inversion = ?, 
                meta = ?, 
                iniico_produccion = ?, 
                fin_produccion = ?, 
                cultivo = ?, 
                sensores = ?, 
                insumos = ?, 
                ciclo_cultivo = ?
             WHERE id = ?`,
            [
                nombre_asociacion, responsable, descripcion, inversion,
                meta, iniico_produccion, fin_produccion, cultivo,
                sensores, insumos, ciclo_cultivo, id
            ]
        );
        res.json({ message: 'Asociación actualizada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la asociación' });
    }
});

module.exports = router; // ✅ ¡Esto va al final!
