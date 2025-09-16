// controllers/cicloCultivoController.js
const db = require('../config/db.js');

// ✅ Insertar un nuevo ciclo de cultivo
const insertarCicloCultivo = (req, res) => {
    console.log("📩 Body recibido:", req.body);

    const { cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image } = req.body;

    // ✅ Validación de campos obligatorios
    if (!cicloID || !cicloName || !siembraDate || !cosechaDate || !news || !description || !state) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // ✅ SQL preparado
    const sql = `
        INSERT INTO ciclocultivo 
        (cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image || null];

    // ✅ Ejecutamos query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Error al insertar el ciclo de cultivo:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al insertar el ciclo de cultivo' });
        }

        console.log('✅ Ciclo de cultivo insertado con ID:', result.insertId);

        // ✅ Respuesta inmediata al frontend
        return res.status(201).json({ 
            id: result.insertId, 
            cicloID, 
            cicloName, 
            siembraDate, 
            cosechaDate, 
            news, 
            description, 
            state,
            image: image || null
        });
    });
};

// ✅ Obtener todos los ciclos de cultivo
const obtenerCiclosCultivo = (req, res) => {
    const sql = 'SELECT id, cicloName, image FROM ciclocultivo';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener los ciclos de cultivo:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al obtener los ciclos de cultivo' });
        }

        console.log(`✅ ${results.length} ciclos de cultivo obtenidos`);
        return res.status(200).json(results);
    });
};

module.exports = {
    insertarCicloCultivo,
    obtenerCiclosCultivo,
};
