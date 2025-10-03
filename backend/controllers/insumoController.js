const db = require('../config/db.js');
const fs = require('fs/promises');
const path = require('path');

const validarNumeroPositivo = (valor) => {
    const num = Number(valor);
    return !isNaN(num) && num >= 0;
};

const validarEstado = (estado) => ['Activo', 'Inactivo'].includes(estado || '');

const deleteFileIfExist = async (filename) => {
    if (!filename) return;
    // Corrección: 'fronted' -> 'frontend'
    const filePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads', filename);
    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};

const insertarInsumo = async (req, res) => {
    try {
        const { nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, descripcion, estado } = req.body;
        const imagen = req.file ? req.file.filename : null;

        // Trim para campos de texto
        const trimmedNombre = nombreInsumo?.trim();
        const trimmedTipo = tipoInsumo?.trim();
        const trimmedDescripcion = descripcion?.trim();
        const trimmedUnidad = unidadMedida?.trim();

        if (!trimmedNombre || !trimmedTipo || !cantidad || !valorUnitario) {
            if (req.file) await deleteFileIfExist(req.file.filename);
            return res.status(400).json({ error: 'Faltan campos obligatorios para insertar el insumo.' });
        }

        if (!validarNumeroPositivo(cantidad) || !validarNumeroPositivo(valorUnitario)) {
            if (req.file) await deleteFileIfExist(req.file.filename);
            return res.status(400).json({ error: 'Cantidad y valor unitario deben ser números positivos o cero.' });
        }

        if (estado && !validarEstado(estado)) {
            if (req.file) await deleteFileIfExist(req.file.filename);
            return res.status(400).json({ error: 'Estado debe ser "Activo" o "Inactivo".' });
        }

        const numericCantidad = Number(cantidad);
        const numericValorUnitario = Number(valorUnitario);
        const numericValorTotal = numericCantidad * numericValorUnitario;

        const sql = `INSERT INTO insumo (nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, valorTotal, descripcion, estado, image)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [trimmedNombre, trimmedTipo, numericCantidad, trimmedUnidad, numericValorUnitario, numericValorTotal, trimmedDescripcion, estado || 'Activo', imagen];

        const [result] = await db.query(sql, values);

        res.status(201).json({ idInsumo: result.insertId, message: 'Insumo registrado correctamente', image: imagen });
    } catch (err) {
        console.error('Error al insertar insumo:', err);
        if (req.file) await deleteFileIfExist(req.file.filename).catch(console.error);
        res.status(500).json({ error: 'Error interno del servidor al insertar el insumo' });
    }
};

const obtenerInsumos = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM insumo');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error al obtener insumos:', err);
        res.status(500).json({ error: 'Error al obtener insumos' });
    }
};

const eliminarInsumo = async (req, res) => {
    try {
        // Verificar permisos (admin o superadmin)
        const user = req.user;
        const allowedRoles = ['admin', 'superadmin'];
        if (!user || !allowedRoles.includes(user.usertype)) {
            return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de admin.' });
        }

        const { id } = req.params;
        const numericId = Number(id);
        if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
            return res.status(400).json({ error: 'ID de insumo inválido.' });
        }

        const [rows] = await db.query('SELECT * FROM insumo WHERE idInsumo = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }

        // Soft-delete: actualizar estado a 'Inactivo'
        const connection = await db.getConnection();
        const [result] = await connection.execute("UPDATE insumo SET estado = 'Inactivo' WHERE idInsumo = ?", [id]);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }

        res.json({ message: 'Insumo desactivado correctamente' });
    } catch (err) {
        console.error('Error al desactivar insumo:', err);
        res.status(500).json({ error: 'Error interno al desactivar insumo' });
    }
};

const obtenerInsumoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM insumo WHERE idInsumo = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener insumo:', err);
        res.status(500).json({ error: 'Error al obtener insumo' });
    }
};

const actualizarInsumo = async (req, res) => {
    const { id } = req.params;
    const { nombreInsumo, tipoInsumo, cantidad, unidadMedida, valorUnitario, descripcion, estado } = req.body;

    try {
        const [current] = await db.query('SELECT image FROM insumo WHERE idInsumo = ?', [id]);
        if (current.length === 0) {
            if (req.file) await deleteFileIfExist(req.file.filename);
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }

        const oldImage = current[0].image;
        let finalImage = oldImage; // Inicializamos con la imagen que está en la BD

        if (req.file) {
            finalImage = req.file.filename; // Usamos la nueva imagen

            // Borramos la imagen antigua SOLO si existía una imagen anterior
            if (oldImage) {
                await deleteFileIfExist(oldImage);
            }
        }

        // Trim para campos de texto
        const trimmedNombre = nombreInsumo?.trim();
        const trimmedTipo = tipoInsumo?.trim();
        const trimmedDescripcion = descripcion?.trim();
        const trimmedUnidad = unidadMedida?.trim();

        if (!validarNumeroPositivo(cantidad) || !validarNumeroPositivo(valorUnitario)) {
            if (req.file) await deleteFileIfExist(req.file.filename);
            return res.status(400).json({ error: 'Cantidad y valor unitario deben ser números positivos o cero.' });
        }

        if (estado && !validarEstado(estado)) {
            if (req.file) await deleteFileIfExist(req.file.filename);
            return res.status(400).json({ error: 'Estado debe ser "Activo" o "Inactivo".' });
        }

        const numericCantidad = Number(cantidad);
        const numericValorUnitario = Number(valorUnitario);
        const numericValorTotal = numericCantidad * numericValorUnitario;

        const [result] = await db.query(
            `UPDATE insumo
             SET nombreInsumo=?, tipoInsumo=?, cantidad=?, unidadMedida=?, valorUnitario=?, valorTotal=?, descripcion=?, estado=?, image=?
             WHERE idInsumo=?`,
            [trimmedNombre, trimmedTipo, numericCantidad, trimmedUnidad, numericValorUnitario, numericValorTotal, trimmedDescripcion, estado, finalImage, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado o sin cambios' });
        }

        res.json({ message: 'Insumo actualizado correctamente', image: finalImage });
    } catch (err) {
        console.error('Error al actualizar insumo:', err);
        if (req.file) {
            await deleteFileIfExist(req.file.filename).catch(console.error);
        }
        res.status(500).json({ error: 'Error interno del servidor al actualizar insumo' });
    }
};

module.exports = {
    insertarInsumo,
    obtenerInsumos,
    obtenerInsumoPorId,
    actualizarInsumo,
    eliminarInsumo,
};
