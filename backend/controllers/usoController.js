const db = require('../config/db.js');

const insertarUso = async (req, res) => {
    try {
        const { fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo } = req.body;

        // Validación de campos obligatorios
        if (!fecha_uso || !cantidad || !responsable || !valor_unitario || !valor_total || !insumo) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (fecha, cantidad, responsable, valor unitario, valor total, insumo)' });
        }

        // --- VALIDACIÓN DE FECHA EN EL SERVIDOR ---
        const fechaUso = new Date(fecha_uso);
        const hoy = new Date();
        
        // Normalizamos para comparar solo la fecha (día, mes, año)
        fechaUso.setHours(0, 0, 0, 0);
        hoy.setHours(0, 0, 0, 0);

        // 1. VALIDACIÓN: No Fecha Futura
        if (fechaUso > hoy) {
            return res.status(400).json({ error: 'La fecha de uso no puede ser una fecha futura.' });
        }
        
        // 2. VALIDACIÓN: No Mes Pasado o Anterior
        // Creamos la fecha del primer día del mes actual
        const primerDiaMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1); 
        primerDiaMesActual.setHours(0, 0, 0, 0); // Normalizar

        if (fechaUso < primerDiaMesActual) {
            return res.status(400).json({ error: 'La fecha de uso no puede ser anterior al mes actual.' });
        }


        // VALIDACIÓN DE CÁLCULO
        const cantidadFloat = parseFloat(cantidad);
        const valorUnitarioFloat = parseFloat(valor_unitario);
        const valorTotalFloat = parseFloat(valor_total);

        // Verificamos que sean números válidos
        if (isNaN(cantidadFloat) || isNaN(valorUnitarioFloat) || isNaN(valorTotalFloat) || cantidadFloat <= 0 || valorUnitarioFloat < 0) {
            return res.status(400).json({ error: 'Cantidad y Valor Unitario deben ser números válidos y positivos.' });
        }

        // Calculamos el valor esperado y comparamos (permitiendo una pequeña tolerancia)
        const valorCalculado = cantidadFloat * valorUnitarioFloat;

        // Tolerancia de 0.01 (un centavo)
        if (Math.abs(valorTotalFloat - valorCalculado) > 0.01) {
            return res.status(400).json({ error: 'El Valor Total calculado en el cliente es incorrecto. Debe ser Cantidad x Valor Unitario.' });
        }

        // Usamos el valor calculado para asegurar la consistencia
        const valorTotalFinal = valorCalculado.toFixed(2);


        const sql = `
            INSERT INTO uso_insumo (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [fecha_uso, cantidadFloat, responsable, valorUnitarioFloat, valorTotalFinal, observaciones, insumo];

        const [result] = await db.query(sql, values);

        res.status(201).json({ id: result.insertId, fecha_uso, cantidad: cantidadFloat, responsable, valor_unitario: valorUnitarioFloat, valor_total: valorTotalFinal, observaciones, insumo });
    } catch (err) {
        console.error('Error al insertar uso_insumo:', err);
        res.status(500).json({ error: 'Error interno del servidor al insertar uso_insumo' });
    }
};

// Obtener todos
const obtenerUsos = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM uso_insumo');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error al obtener usos de insumo:', err);
        res.status(500).json({ error: 'Error al obtener usos de insumo' });
    }
};

// Obtener uno por ID
const obtenerUsoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM uso_insumo WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Uso de insumo no encontrado" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Error al obtener uso_insumo:", err);
        res.status(500).json({ error: "Error al obtener uso_insumo" });
    }
};

// Actualizar
const actualizarUso = async (req, res) => {
    const { id } = req.params;
    const { fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo } = req.body;
    // Nota: Las validaciones de fecha y valor total también deberían aplicarse aquí en un entorno de producción.
    try {
        const sql = `
            UPDATE uso_insumo
            SET fecha_uso = ?, cantidad = ?, responsable = ?, valor_unitario = ?, valor_total = ?, observaciones = ?, insumo = ?
            WHERE id = ?
        `;
        const values = [fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo, id];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Uso de insumo no encontrado" });
        }

        res.json({ message: "Uso de insumo actualizado correctamente" });
    } catch (err) {
        console.error("Error al actualizar uso_insumo:", err);
        res.status(500).json({ error: "Error al actualizar uso_insumo" });
    }
};

module.exports = {
    insertarUso,
    obtenerUsos,
    obtenerUsoPorId,
    actualizarUso,
};