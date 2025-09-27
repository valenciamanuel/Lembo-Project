const pool = require('../config/db'); 
const fs = require('fs');
const path = require('path');

// --- Función de utilidad para eliminar el archivo ---
const deleteFileIfExist = (filename) => {
    if (filename) {
        // Aseguramos la ruta correcta a la carpeta 'uploads'
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename); 
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Archivo ${filename} eliminado.`);
            } catch (err) {
                console.error(`❌ Error al eliminar el archivo ${filename}:`, err);
            }
        }
    }
};

// Insertar cultivo
const insertarCultivo = async (req, res) => {
    const { cultivoType, cultivoName, cultivoID, size, location, description, state } = req.body;
    const image = req.file ? req.file.filename : null; 

    try {
        // ✅ CORRECCIÓN CLAVE: `description` fue eliminada de la validación
        if (!cultivoType || !cultivoName || !cultivoID || !size || !location || !state) {
            deleteFileIfExist(image);
            return res.status(400).json({ error: 'Faltan campos obligatorios para el registro del cultivo: Tipo, Nombre, ID, Tamaño, Ubicación y Estado.' });
        }

        const sql = `
            INSERT INTO cultivo 
            (cultivoType, cultivoName, cultivoID, size, location, description, state, image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        // ✅ AJUSTE: Si description está vacío o solo tiene espacios, lo convertimos a NULL para la DB
        const descriptionValue = description && description.trim() !== '' ? description : null;

        const values = [cultivoType, cultivoName, cultivoID, size, location, descriptionValue, state, image]; 
        
        const [result] = await pool.query(sql, values);

        const nuevoId = result.insertId;
        console.log('✅ Cultivo insertado correctamente:', nuevoId);

        res.status(201).json({
            id: nuevoId,
            cultivoName,
            cultivoID,
            image
        });
    } catch (err) {
        console.error('❌ Error al insertar el cultivo en la BD:', err);
        deleteFileIfExist(image); 
        res.status(500).json({ error: 'Error al insertar el cultivo. Revisa si el ID es duplicado o la DB está desconectada.' });
    }
};

// Obtener cultivos
const obtenerCultivos = async (req, res) => {
    try {
        const sql = 'SELECT * FROM cultivo';
        const [results] = await pool.query(sql); 
        res.status(200).json(results);
    } catch (err) {
        console.error('❌ Error al obtener los cultivos:', err);
        res.status(500).json({ error: 'Error al obtener los cultivos' });
    }
};

// Obtener un solo cultivo por su ID
const obtenerCultivoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'SELECT * FROM cultivo WHERE id = ?'; 
        const [rows] = await pool.query(sql, [id]); 
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }
        
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('❌ Error al obtener el cultivo:', err.message || err);
        res.status(500).json({ error: 'Error al obtener el cultivo' });
    }
};

// Actualizar un cultivo
const actualizarCultivo = async (req, res) => {
    const { id } = req.params;
    const { cultivoType, cultivoName, cultivoID, size, location, description, state } = req.body;
    
    // ✅ CORRECCIÓN CLAVE: `description` fue eliminada de la validación
    if (!cultivoType || !cultivoName || !cultivoID || !size || !location || !state) {
        return res.status(400).json({ error: 'Todos los campos obligatorios deben estar llenos.' });
    }

    try {
        // ✅ AJUSTE: Si description está vacío o solo tiene espacios, lo convertimos a NULL para la DB.
        const descriptionValue = description && description.trim() !== '' ? description : null;

        const sql = `
            UPDATE cultivo 
            SET cultivoType = ?, cultivoName = ?, cultivoID = ?, size = ?, location = ?, description = ?, state = ?
            WHERE id = ?
        `;
        const values = [cultivoType, cultivoName, cultivoID, size, location, descriptionValue, state, id];
        
        const [result] = await pool.query(sql, values); 

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }

        res.status(200).json({ message: 'Cultivo actualizado exitosamente' });
    } catch (err) {
        console.error('❌ Error al actualizar el cultivo:', err.message || err);
        res.status(500).json({ error: 'Error al actualizar el cultivo' });
    }
};

module.exports = {
    insertarCultivo,
    obtenerCultivos,
    obtenerCultivoPorId,
    actualizarCultivo,
};
