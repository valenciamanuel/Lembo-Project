const pool = require('../config/db');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

const UPLOADS_PATH = path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_PATH),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
        cb(null, name);
    }
});
const upload = multer({ storage });

const deleteFileIfExist = async filename => {
    if (!filename) return;
    const filePath = path.join(UPLOADS_PATH, filename);
    try { await fs.unlink(filePath); } catch {}
};

// Valida que el ID de cultivo sea un número entero positivo
const validarCultivoID = (id) => {
    const numericId = Number(id);
    return !isNaN(numericId) && Number.isInteger(numericId) && numericId > 0;
};

// Valida que el tamaño sea un número positivo
const validarSize = (size) => {
    const numericSize = Number(size);
    return !isNaN(numericSize) && numericSize > 0;
};

const insertarCultivo = async (req, res) => {
    const { cultivoType, cultivoName, cultivoID, size, location, description, state } = req.body;
    const image = req.file ? req.file.filename : null;
    
    if (!cultivoType || !cultivoName || !cultivoID || !size || !location || !state) {
        await deleteFileIfExist(image);
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    // Validación y conversión del ID de Cultivo
    if (!validarCultivoID(cultivoID)) {
        await deleteFileIfExist(image);
        return res.status(400).json({ error: 'El ID de cultivo debe ser un número entero positivo.' });
    }
    const numericCultivoID = Number(cultivoID); // Aseguramos que sea número para la inserción
    
    // Validación y conversión del Tamaño
    if (!validarSize(size)) {
        await deleteFileIfExist(image);
        return res.status(400).json({ error: 'El tamaño debe ser un número positivo.' });
    }
    const numericSize = Number(size); // Aseguramos que sea número para la inserción
    
    const descVal = description?.trim() ? description : null;
    
    try {
        const sql = `
            INSERT INTO cultivo
            (cultivoType,cultivoName,cultivoID,size,location,description,state,image)
            VALUES(?,?,?,?,?,?,?,?)
        `;
        // Usamos los valores numéricos validados y convertidos
        const vals = [cultivoType, cultivoName, numericCultivoID, numericSize, location, descVal, state.toLowerCase(), image];
        const [resDB] = await pool.query(sql, vals);
        res.status(201).json({ id: resDB.insertId, cultivoName, cultivoID, image });
    } catch (err) {
        await deleteFileIfExist(image);
        console.error(err);
        res.status(500).json({ error: 'Error al insertar cultivo' });
    }
};

const obtenerCultivos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cultivo');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener cultivos' });
    }
};

const obtenerCultivoPorId = async (req, res) => {
    try {
        const id = req.params.id;
        
        const numericId = Number(id);
        if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
            return res.status(400).json({ error: "El ID de búsqueda debe ser un número entero positivo." });
        }
        
        const [rows] = await pool.query('SELECT * FROM cultivo WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener cultivo' });
    }
};

const actualizarCultivo = async (req, res) => {
    const { id } = req.params;
    const { cultivoType, cultivoName, cultivoID, size, location, description, state, image: oldImage } = req.body;
    let newImage = req.file ? req.file.filename : oldImage;
    
    const numericId = Number(id);
    if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
        return res.status(400).json({ error: "El ID a actualizar debe ser un número entero positivo." });
    }
    
    if (req.file && oldImage && oldImage !== newImage) {
        await deleteFileIfExist(oldImage);
    }
    
    if (!cultivoType || !cultivoName || !cultivoID || !size || !location || !state) {
        if (req.file) await deleteFileIfExist(newImage);
        return res.status(400).json({ error: 'Campos obligatorios faltantes.' });
    }
    
    // 1. Validación y conversión del ID de Cultivo
    if (!validarCultivoID(cultivoID)) {
        if (req.file) await deleteFileIfExist(newImage);
        return res.status(400).json({ error: 'El ID de cultivo debe ser un número entero positivo.' });
    }
    const numericCultivoID = Number(cultivoID); // Aseguramos que sea número para la inserción
    
    // 2. Validación y conversión del Tamaño
    if (!validarSize(size)) {
        if (req.file) await deleteFileIfExist(newImage);
        return res.status(400).json({ error: 'El tamaño debe ser un número positivo.' });
    }
    const numericSize = Number(size); // Aseguramos que sea número para la inserción
    
    const descVal = description?.trim() ? description : null;
    
    try {
        const sql = `
            UPDATE cultivo SET
            cultivoType=?, cultivoName=?, cultivoID=?, size=?, location=?,
            description=?, state=?, image=?
            WHERE id=?
        `;
        // Usamos los valores numéricos validados y convertidos
        const vals = [cultivoType, cultivoName, numericCultivoID, numericSize, location, descVal, state.toLowerCase(), newImage, id];
        const [result] = await pool.query(sql, vals);
        
        if (!result.affectedRows) {
            if (req.file) await deleteFileIfExist(newImage);
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }
        
        res.json({ message: 'Cultivo actualizado', image: newImage });
    } catch (err) {
        if (req.file) await deleteFileIfExist(newImage);
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar cultivo' });
    }
};

module.exports = {
    upload,
    insertarCultivo,
    obtenerCultivos,
    obtenerCultivoPorId,
    actualizarCultivo
};
