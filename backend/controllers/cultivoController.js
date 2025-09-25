const db = require('../config/db.js');

// Insertar cultivo
const insertarCultivo = async (req, res) => {
    try {
        const { cultivoType, cultivoName, cultivoID, size, location, description, state, image } = req.body;

        // Validación
        if (!cultivoType || !cultivoName || !cultivoID || !size || !location || !description || !state || !image) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const sql = `
            INSERT INTO cultivo 
            (cultivoType, cultivoName, cultivoID, size, location, description, state, image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [cultivoType, cultivoName, cultivoID, size, location, description, state, image];

        // Usar await porque db es un pool con promesas
        const [result] = await db.query(sql, values);

        const nuevoId = result.insertId;
        console.log('✅ Cultivo insertado correctamente:', nuevoId);

        res.status(201).json({
            id: nuevoId,
            cultivoType,
            cultivoName,
            cultivoID,
            size,
            location,
            description,
            state,
            image
        });
    } catch (err) {
        console.error('❌ Error al insertar el cultivo:', err);
        res.status(500).json({ error: 'Error al insertar el cultivo' });
    }
};

// Obtener cultivos
const obtenerCultivos = async (req, res) => {
    try {
        const sql = 'SELECT * FROM cultivo'; // Traer todo
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('❌ Error al obtener los cultivos:', err);
        res.status(500).json({ error: 'Error al obtener los cultivos' });
    }
};

module.exports = {
    insertarCultivo,
    obtenerCultivos,
};
