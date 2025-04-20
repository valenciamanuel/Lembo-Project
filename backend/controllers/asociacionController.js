const db = require('../config/db.js');

const insertarAsociacion = (req, res) => {
    const { responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo } = req.body;
    
    if (!responsable || !nombre_asociacion || !inversion || !meta || !iniico_produccion || !fin_produccion || !cultivo || !sensores || !insumos || !ciclo_cultivo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO asociaciones (responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar Asociacion:', err);
            return res.status(500).json({ error: 'Error al insertar Asociación' });
        }
        res.status(201).json({ id: result.insertId, responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo });
    });
};  

module.exports = {
    insertarAsociacion,
};