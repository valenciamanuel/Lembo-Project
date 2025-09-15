const db = require('../config/db.js');

const insertarCicloCultivo = (req, res) => {
    const { cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image } = req.body;

    if (!cicloID || !cicloName || !siembraDate || !cosechaDate || !news || !description || !state) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `
        INSERT INTO ciclocultivo 
        (cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [cicloID, cicloName, siembraDate, cosechaDate, news, description, state, image || null];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar el ciclo de cultivo:', err);
            return res.status(500).json({ error: 'Error al insertar el ciclo de cultivo' });
        }
        // 👇 return agregado para cerrar bien el flujo
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

const obtenerCiclosCultivo = (req, res) => {
    const sql = 'SELECT id, cicloName, image FROM ciclocultivo';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener los ciclos de cultivo:', err);
            return res.status(500).json({ error: 'Error al obtener los ciclos de cultivo' });
        }
        // 👇 también return aquí
        return res.status(200).json(results);
    });
};

module.exports = {
    insertarCicloCultivo,
    obtenerCiclosCultivo,
};
