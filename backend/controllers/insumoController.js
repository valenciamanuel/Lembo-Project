const db = require('../config/db.js');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

// Directorio de uploads en el frontend
const UPLOADS_PATH = path.join(__dirname, '..', '..', 'fronted', 'public', 'uploads');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_PATH);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random()*1E9)}${ext}`;
        cb(null, name);
    }
});
const upload = multer({ storage });

// --- Funciones de Validación y Archivo ---
const validarNumeroPositivo = (value) => {
    const numericValue = Number(value);
    // Permite cero, pero no negativos
    return !isNaN(numericValue) && numericValue >= 0; 
};

const deleteFileIfExist = async filename => {
    if (!filename) return;
    const filePath = path.join(UPLOADS_PATH, filename);
    try { await fs.unlink(filePath); } catch {}
};
// ------------------------------------

const insertarInsumo = async (req, res) => {
    // Eliminamos 'valorTotal' de la desestructuración de req.body
    const { tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, descripcion, estado } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validaciones de campos obligatorios
    if (!tipoInsumo || !nombreInsumo || !unidadMedida || cantidad == null ||
        valorUnitario == null || !descripcion || !estado) {
        await deleteFileIfExist(image);
        return res.status(400).json({ error: 'Todos los campos son obligatorios (image opcional)' });
    }

    // Validación de valores numéricos
    if (!validarNumeroPositivo(cantidad)) {
        await deleteFileIfExist(image);
        return res.status(400).json({ error: 'La cantidad debe ser un número positivo o cero.' });
    }
    const numericCantidad = Number(cantidad);

    if (!validarNumeroPositivo(valorUnitario)) {
        await deleteFileIfExist(image);
        return res.status(400).json({ error: 'El valor unitario debe ser un número positivo o cero.' });
    }
    const numericValorUnitario = Number(valorUnitario);

    // CÁLCULO DEL VALOR TOTAL EN EL BACKEND
    const numericValorTotal = numericCantidad * numericValorUnitario;

    try {
        const sql = `
INSERT INTO insumo
(tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado, image)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`.trim(); // <--- SOLUCIÓN: El .trim() elimina los espacios y saltos de línea molestos

        // Usamos las variables numéricas validadas, incluyendo el valorTotal recalculado
        const values = [
            tipoInsumo, nombreInsumo, unidadMedida, numericCantidad, 
            numericValorUnitario, numericValorTotal, descripcion, estado, image
        ];
        const [result] = await db.query(sql, values);
        res.status(201).json({ idInsumo: result.insertId, tipoInsumo, nombreInsumo, unidadMedida, cantidad: numericCantidad, valorUnitario: numericValorUnitario, valorTotal: numericValorTotal, descripcion, estado, image });
    } catch (err) {
        await deleteFileIfExist(image);
        console.error(' Error al insertar el insumo:', err);
        res.status(500).json({ error: 'Error al insertar el insumo' });
    }
};

const obtenerInsumos = async (req, res) => {
    try {
        const sql = 'SELECT idInsumo, tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado, image FROM insumo';
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error(' Error al obtener los insumos:', err);
        res.status(500).json({ error: 'Error al obtener los insumos' });
    }
};

const obtenerInsumoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM insumo WHERE idInsumo = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Insumo no encontrado" });
        res.json(rows[0]);
    } catch (err) {
        console.error("Error al obtener insumo:", err);
        res.status(500).json({ error: "Error al obtener insumo" });
    }
};

const actualizarInsumo = async (req, res) => {
    const { id } = req.params;
    // Eliminamos 'valorTotal' de la desestructuración de req.body
    let { nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, descripcion, estado, image: oldImage } = req.body;
    const newImage = req.file ? req.file.filename : oldImage;

    const deleteNewFileOnError = req.file ? deleteFileIfExist(newImage) : null;
    
    if (req.file && oldImage && newImage !== oldImage) {
        await deleteFileIfExist(oldImage);
    }
    
    // Validación de valores numéricos
    if (!validarNumeroPositivo(cantidad)) {
        if (req.file) await deleteNewFileOnError;
        return res.status(400).json({ error: 'La cantidad debe ser un número positivo o cero.' });
    }
    const numericCantidad = Number(cantidad);

    if (!validarNumeroPositivo(valorUnitario)) {
        if (req.file) await deleteNewFileOnError;
        return res.status(400).json({ error: 'El valor unitario debe ser un número positivo o cero.' });
    }
    const numericValorUnitario = Number(valorUnitario);

    // CÁLCULO DEL VALOR TOTAL EN EL BACKEND
    const numericValorTotal = numericCantidad * numericValorUnitario;

    try {
        const sql = `
UPDATE insumo
SET nombreInsumo=?, tipoInsumo=?, cantidad=?, unidadMedida=?, valorUnitario=?, valorTotal=?, descripcion=?, estado=?, image=?
WHERE idInsumo=?
`.trim(); // <--- SOLUCIÓN: El .trim() elimina los espacios y saltos de línea molestos
        // Usamos el valorTotal recalculado
        const values = [
            nombreInsumo, tipoInsumo, numericCantidad, unidadMedida, 
            numericValorUnitario, numericValorTotal, descripcion, estado, newImage, id
        ];
        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            if (req.file) await deleteNewFileOnError;
            return res.status(404).json({ error: "Insumo no encontrado o sin cambios" });
        }
        res.json({ message: " Insumo actualizado correctamente", image: newImage });
    } catch (err) {
        if (req.file) await deleteFileIfExist(req.file.filename).catch(console.error);
        console.error(" Error al actualizar insumo:", err);
        res.status(500).json({ error: "Error al actualizar insumo" });
    }
};

module.exports = {
    upload,
    insertarInsumo,
    obtenerInsumos,
    obtenerInsumoPorId,
    actualizarInsumo
};
