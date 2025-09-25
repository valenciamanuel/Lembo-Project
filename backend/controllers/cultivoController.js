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

// New function to get a single crop by its ID
const obtenerCultivoPorId = async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.execute('SELECT * FROM cultivo WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }
        
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('❌ Error al obtener el cultivo:', err.message || err);
        res.status(500).json({ error: 'Error al obtener el cultivo' });
    } finally {
        if (connection) connection.release();
    }
};

// New function to update a crop
const actualizarCultivo = async (req, res) => {
    const { id } = req.params;
    const { cultivoType, cultivoName, cultivoID, size, location, description, state } = req.body;
    
    if (!cultivoType || !cultivoName || !cultivoID || !size || !location || !description || !state) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    let connection;
    try {
        const sql = `
            UPDATE cultivo 
            SET cultivoType = ?, cultivoName = ?, cultivoID = ?, size = ?, location = ?, description = ?, state = ?
            WHERE id = ?
        `;
        const values = [cultivoType, cultivoName, cultivoID, size, location, description, state, id];
        
        connection = await db.getConnection();
        const [result] = await connection.execute(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }

        res.status(200).json({ message: 'Cultivo actualizado exitosamente' });
    } catch (err) {
        console.error('❌ Error al actualizar el cultivo:', err.message || err);
        res.status(500).json({ error: 'Error al actualizar el cultivo' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    insertarCultivo,
    obtenerCultivos,
    obtenerCultivoPorId,
    actualizarCultivo,
};
