const db = require("../config/db.js")

const insertarAsociacion = async (req, res) => {
  const {
    responsable,
    nombre_asociacion,
    inversion,
    meta,
    iniico_produccion,
    fin_produccion,
    cultivo,
    sensores,
    insumos,
    ciclo_cultivo,
    insumos_detalle, // Nueva información detallada de insumos
  } = req.body

  // Validaciones básicas
  if (
    !responsable ||
    !nombre_asociacion ||
    !inversion ||
    !meta ||
    !iniico_produccion ||
    !fin_produccion ||
    !cultivo ||
    !sensores ||
    !insumos ||
    !ciclo_cultivo
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" })
  }

  // Validar que insumos_detalle esté presente y sea un array
  if (!insumos_detalle || !Array.isArray(insumos_detalle) || insumos_detalle.length === 0) {
    return res.status(400).json({ error: "Debe proporcionar detalles de al menos un insumo" })
  }

  // Validar máximo 3 insumos
  if (insumos_detalle.length > 3) {
    return res.status(400).json({ error: "No puede seleccionar más de 3 insumos" })
  }

  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    // Validar disponibilidad de insumos y cantidades
    for (const insumoDetalle of insumos_detalle) {
      const [insumoRows] = await connection.query(
        'SELECT cantidad FROM insumo WHERE idInsumo = ? AND estado = "activo"',
        [insumoDetalle.id],
      )

      if (insumoRows.length === 0) {
        throw new Error(`Insumo con ID ${insumoDetalle.id} no encontrado o inactivo`)
      }

      const cantidadDisponible = Number.parseFloat(insumoRows[0].cantidad)
      const cantidadSolicitada = Number.parseFloat(insumoDetalle.cantidad)

      if (cantidadSolicitada > cantidadDisponible) {
        throw new Error(
          `Cantidad solicitada de ${insumoDetalle.nombre} (${cantidadSolicitada}) excede la disponible (${cantidadDisponible})`,
        )
      }
    }

    // Insertar la asociación
    const sqlAsociacion = `
            INSERT INTO asociaciones 
            (responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

    const valuesAsociacion = [
      responsable,
      nombre_asociacion,
      inversion,
      meta,
      iniico_produccion,
      fin_produccion,
      cultivo,
      sensores,
      insumos,
      ciclo_cultivo,
    ]

    const [resultAsociacion] = await connection.query(sqlAsociacion, valuesAsociacion)
    const asociacionId = resultAsociacion.insertId

    // Actualizar cantidades de insumos y registrar uso
    for (const insumoDetalle of insumos_detalle) {
      // Obtener información completa del insumo
      const [insumoInfo] = await connection.query("SELECT * FROM insumo WHERE idInsumo = ?", [insumoDetalle.id])

      const insumo = insumoInfo[0]
      const nuevaCantidad = Number.parseFloat(insumo.cantidad) - Number.parseFloat(insumoDetalle.cantidad)
      const nuevoValorTotal = nuevaCantidad * Number.parseFloat(insumo.valorUnitario)

      // Actualizar cantidad en tabla insumo
      await connection.query("UPDATE insumo SET cantidad = ?, valorTotal = ? WHERE idInsumo = ?", [
        nuevaCantidad,
        nuevoValorTotal,
        insumoDetalle.id,
      ])

      // Registrar uso del insumo
      await connection.query(
        `INSERT INTO uso_insumo 
                (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo) 
                VALUES (CURDATE(), ?, ?, ?, ?, ?, ?)`,
        [
          insumoDetalle.cantidad,
          responsable,
          insumo.valorUnitario,
          Number.parseFloat(insumoDetalle.cantidad) * Number.parseFloat(insumo.valorUnitario),
          `Uso en asociación: ${nombre_asociacion} (ID: ${asociacionId})`,
          insumo.nombreInsumo,
        ],
      )
    }

    await connection.commit()

    res.status(201).json({
      id: asociacionId,
      responsable,
      nombre_asociacion,
      inversion,
      meta,
      iniico_produccion,
      fin_produccion,
      cultivo,
      sensores,
      insumos,
      ciclo_cultivo,
      message: "Asociación creada exitosamente",
    })
  } catch (error) {
    await connection.rollback()
    console.error("Error al insertar Asociación:", error)
    res.status(500).json({ error: error.message || "Error al insertar Asociación" })
  } finally {
    connection.release()
  }
}

const actualizarAsociacion = async (req, res) => {
  const id = req.params.id
  const {
    nombre_asociacion,
    responsable,
    inversion,
    meta,
    iniico_produccion,
    fin_produccion,
    cultivo,
    sensores,
    insumos,
    ciclo_cultivo,
    insumos_detalle, // Nueva información detallada de insumos
  } = req.body

  if (!id) {
    return res.status(400).json({ error: "ID de asociación requerido" })
  }

  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    // Obtener la asociación actual para comparar cambios en insumos
    const [asociacionActual] = await connection.query("SELECT insumos FROM asociaciones WHERE id = ?", [id])

    if (asociacionActual.length === 0) {
      throw new Error("Asociación no encontrada")
    }

    // Si se proporcionan nuevos detalles de insumos, validar y actualizar
    if (insumos_detalle && Array.isArray(insumos_detalle)) {
      if (insumos_detalle.length > 3) {
        throw new Error("No puede seleccionar más de 3 insumos")
      }

      // Validar disponibilidad de insumos
      for (const insumoDetalle of insumos_detalle) {
        const [insumoRows] = await connection.query(
          'SELECT cantidad FROM insumo WHERE idInsumo = ? AND estado = "activo"',
          [insumoDetalle.id],
        )

        if (insumoRows.length === 0) {
          throw new Error(`Insumo con ID ${insumoDetalle.id} no encontrado o inactivo`)
        }

        const cantidadDisponible = Number.parseFloat(insumoRows[0].cantidad)
        const cantidadSolicitada = Number.parseFloat(insumoDetalle.cantidad)

        if (cantidadSolicitada > cantidadDisponible) {
          throw new Error(
            `Cantidad solicitada de ${insumoDetalle.nombre} (${cantidadSolicitada}) excede la disponible (${cantidadDisponible})`,
          )
        }
      }
    }

    // Actualizar la asociación
    const sqlUpdate = `
            UPDATE asociaciones SET 
                nombre_asociacion = ?,
                responsable = ?,
                inversion = ?,
                meta = ?,
                iniico_produccion = ?,
                fin_produccion = ?,
                cultivo = ?,
                sensores = ?,
                insumos = ?,
                ciclo_cultivo = ?
            WHERE id = ?
        `

    await connection.query(sqlUpdate, [
      nombre_asociacion,
      responsable,
      inversion,
      meta,
      iniico_produccion,
      fin_produccion,
      cultivo,
      sensores,
      insumos,
      ciclo_cultivo,
      id,
    ])

    // Si hay cambios en insumos, registrar el uso
    if (insumos_detalle && Array.isArray(insumos_detalle)) {
      for (const insumoDetalle of insumos_detalle) {
        // Obtener información del insumo
        const [insumoInfo] = await connection.query("SELECT * FROM insumo WHERE idInsumo = ?", [insumoDetalle.id])

        const insumo = insumoInfo[0]

        // Registrar uso del insumo (para auditoría)
        await connection.query(
          `INSERT INTO uso_insumo 
                    (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo) 
                    VALUES (CURDATE(), ?, ?, ?, ?, ?, ?)`,
          [
            insumoDetalle.cantidad,
            responsable,
            insumo.valorUnitario,
            Number.parseFloat(insumoDetalle.cantidad) * Number.parseFloat(insumo.valorUnitario),
            `Actualización en asociación: ${nombre_asociacion} (ID: ${id})`,
            insumo.nombreInsumo,
          ],
        )
      }
    }

    await connection.commit()
    res.json({ message: "Asociación actualizada correctamente" })
  } catch (error) {
    await connection.rollback()
    console.error("Error al actualizar asociación:", error)
    res.status(500).json({ error: error.message || "Error al actualizar la asociación" })
  } finally {
    connection.release()
  }
}

const eliminarAsociacion = async (req, res) => {
  const id = req.params.id

  if (!id) {
    return res.status(400).json({ error: "ID de asociación requerido" })
  }

  try {
    const [result] = await db.query("DELETE FROM asociaciones WHERE id = ?", [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Asociación no encontrada" })
    }

    res.json({ message: "Asociación eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar asociación:", error)
    res.status(500).json({ error: "Error al eliminar la asociación" })
  }
}

module.exports = {
  insertarAsociacion,
  actualizarAsociacion,
  eliminarAsociacion,
}
