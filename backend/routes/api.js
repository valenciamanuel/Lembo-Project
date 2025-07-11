// Importar módulos necesarios
const mysql = require("mysql2")
const express = require("express")
const router = express.Router()

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "lembo",
  multipleStatements: true,
})

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err)
    return
  }
  console.log("Conexión a MySQL establecida")
})

// Funciones de validación actualizadas
function validarAsociacion(data) {
  const errores = []

  // Validar campos obligatorios
  if (!data.responsable || data.responsable.trim() === "") {
    errores.push("El responsable es obligatorio")
  } else if (data.responsable.length > 30) {
    errores.push("El responsable no puede exceder los 30 caracteres")
  }

  if (!data.nombre_asociacion || data.nombre_asociacion.trim() === "") {
    errores.push("El nombre de la asociación es obligatorio")
  } else if (data.nombre_asociacion.length > 20) {
    errores.push("El nombre de la asociación no puede exceder los 20 caracteres")
  }

  if (!data.inversion || isNaN(Number.parseFloat(data.inversion))) {
    errores.push("La inversión debe ser un número válido")
  } else if (Number.parseFloat(data.inversion) <= 0) {
    errores.push("La inversión debe ser mayor que cero")
  }

  if (!data.meta || isNaN(Number.parseFloat(data.meta))) {
    errores.push("La meta debe ser un número válido")
  } else if (Number.parseFloat(data.meta) <= 0) {
    errores.push("La meta debe ser mayor que cero")
  }

  if (!data.iniico_produccion) {
    errores.push("La fecha de inicio de producción es obligatoria")
  }

  if (!data.fin_produccion) {
    errores.push("La fecha de fin de producción es obligatoria")
  }

  if (data.iniico_produccion && data.fin_produccion) {
    const inicio = new Date(data.iniico_produccion)
    const fin = new Date(data.fin_produccion)
    if (inicio > fin) {
      errores.push("La fecha de inicio no puede ser posterior a la fecha de fin")
    }
  }

  if (!data.cultivo || data.cultivo.trim() === "") {
    errores.push("El cultivo es obligatorio")
  }

  if (!data.sensores || data.sensores.trim() === "") {
    errores.push("Debe seleccionar al menos un sensor")
  }

  if (!data.insumos || data.insumos.trim() === "") {
    errores.push("Debe seleccionar al menos un insumo")
  }

  // Nueva validación para insumos_detalle
  if (!data.insumos_detalle || !Array.isArray(data.insumos_detalle) || data.insumos_detalle.length === 0) {
    errores.push("Debe proporcionar detalles de al menos un insumo")
  } else if (data.insumos_detalle.length > 3) {
    errores.push("No puede seleccionar más de 3 insumos")
  } else {
    // Validar cada insumo en el detalle
    data.insumos_detalle.forEach((insumo, index) => {
      if (!insumo.id || !insumo.nombre || !insumo.cantidad) {
        errores.push(`El insumo ${index + 1} debe tener id, nombre y cantidad`)
      } else if (isNaN(Number.parseFloat(insumo.cantidad)) || Number.parseFloat(insumo.cantidad) <= 0) {
        errores.push(`La cantidad del insumo ${insumo.nombre} debe ser un número positivo`)
      }
    })
  }

  if (!data.ciclo_cultivo || data.ciclo_cultivo.trim() === "") {
    errores.push("El ciclo de cultivo es obligatorio")
  }

  return errores
}

// Función para validar cultivo (sin cambios)
function validarCultivo(data) {
  const errores = []

  if (!data.cultivoType || data.cultivoType.trim() === "") {
    errores.push("El tipo de cultivo es obligatorio")
  }

  if (!data.cultivoName || data.cultivoName.trim() === "") {
    errores.push("El nombre del cultivo es obligatorio")
  }

  if (!data.cultivoID || data.cultivoID.trim() === "") {
    errores.push("El ID del cultivo es obligatorio")
  }

  if (!data.state || !["Activo", "Inactivo"].includes(data.state)) {
    errores.push("El estado debe ser Activo o Inactivo")
  }

  return errores
}

// Función para validar ciclo (sin cambios)
function validarCiclo(data) {
  const errores = []

  if (!data.cicloID || data.cicloID.trim() === "") {
    errores.push("El ID del ciclo es obligatorio")
  }

  if (!data.cicloName || data.cicloName.trim() === "") {
    errores.push("El nombre del ciclo es obligatorio")
  }

  if (!data.siembraDate) {
    errores.push("La fecha de siembra es obligatoria")
  }

  if (!data.cosechaDate) {
    errores.push("La fecha de cosecha es obligatoria")
  }

  if (data.siembraDate && data.cosechaDate) {
    const siembra = new Date(data.siembraDate)
    const cosecha = new Date(data.cosechaDate)
    if (siembra > cosecha) {
      errores.push("La fecha de siembra no puede ser posterior a la fecha de cosecha")
    }
  }

  if (!data.state || !["activo", "inactivo"].includes(data.state)) {
    errores.push("El estado debe ser activo o inactivo")
  }

  return errores
}

// Función para validar insumo (sin cambios)
function validarInsumo(data) {
  const errores = []

  if (!data.tipoInsumo || data.tipoInsumo.trim() === "") {
    errores.push("El tipo de insumo es obligatorio")
  } else if (data.tipoInsumo.length > 20) {
    errores.push("El tipo de insumo no puede exceder los 20 caracteres")
  }

  if (!data.nombreInsumo || data.nombreInsumo.trim() === "") {
    errores.push("El nombre del insumo es obligatorio")
  } else if (data.nombreInsumo.length > 20) {
    errores.push("El nombre del insumo no puede exceder los 20 caracteres")
  }

  if (!data.unidadMedida || data.unidadMedida.trim() === "") {
    errores.push("La unidad de medida es obligatoria")
  } else if (data.unidadMedida.length > 10) {
    errores.push("La unidad de medida no puede exceder los 10 caracteres")
  }

  if (!data.cantidad || isNaN(Number.parseFloat(data.cantidad))) {
    errores.push("La cantidad debe ser un número válido")
  } else if (Number.parseFloat(data.cantidad) < 0) {
    errores.push("La cantidad no puede ser negativa")
  }

  if (!data.valorUnitario || isNaN(Number.parseFloat(data.valorUnitario))) {
    errores.push("El valor unitario debe ser un número válido")
  } else if (Number.parseFloat(data.valorUnitario) <= 0) {
    errores.push("El valor unitario debe ser mayor que cero")
  }

  if (!data.estado || !["activo", "inactivo"].includes(data.estado)) {
    errores.push("El estado debe ser activo o inactivo")
  }

  return errores
}

// Nueva función para obtener múltiples insumos por IDs
function obtenerInsumosPorIds(idsInsumos, callback) {
  if (!idsInsumos || idsInsumos.length === 0) {
    return callback(null, [])
  }

  const placeholders = idsInsumos.map(() => "?").join(",")
  const query = `SELECT * FROM insumo WHERE idInsumo IN (${placeholders}) AND estado = 'activo'`

  db.query(query, idsInsumos, (err, results) => {
    if (err) {
      return callback(err, null)
    }
    callback(null, results)
  })
}

// Función actualizada para procesar múltiples insumos
function procesarInsumosAsociacion(insumosDetalle, responsable, nombreAsociacion, callback) {
  if (!insumosDetalle || insumosDetalle.length === 0) {
    return callback(new Error("No se proporcionaron insumos"))
  }

  const idsInsumos = insumosDetalle.map((insumo) => insumo.id)

  // Obtener información de todos los insumos
  obtenerInsumosPorIds(idsInsumos, (err, insumos) => {
    if (err) {
      return callback(err)
    }

    if (insumos.length !== insumosDetalle.length) {
      return callback(new Error("Algunos insumos no fueron encontrados o están inactivos"))
    }

    // Validar disponibilidad de cada insumo
    const validaciones = []
    const actualizaciones = []
    const registrosUso = []

    for (const detalleInsumo of insumosDetalle) {
      const insumo = insumos.find((i) => i.idInsumo === detalleInsumo.id)

      if (!insumo) {
        return callback(new Error(`Insumo con ID ${detalleInsumo.id} no encontrado`))
      }

      const cantidadDisponible = Number.parseFloat(insumo.cantidad)
      const cantidadSolicitada = Number.parseFloat(detalleInsumo.cantidad)

      if (cantidadSolicitada > cantidadDisponible) {
        return callback(
          new Error(
            `No hay suficiente cantidad de ${insumo.nombreInsumo}. Disponible: ${cantidadDisponible}, Solicitado: ${cantidadSolicitada}`,
          ),
        )
      }

      // Preparar actualización
      const nuevaCantidad = cantidadDisponible - cantidadSolicitada
      const nuevoValorTotal = nuevaCantidad * Number.parseFloat(insumo.valorUnitario)

      actualizaciones.push({
        id: insumo.idInsumo,
        nuevaCantidad: nuevaCantidad,
        nuevoValorTotal: nuevoValorTotal,
      })

      // Preparar registro de uso
      registrosUso.push({
        fecha_uso: new Date().toISOString().split("T")[0],
        cantidad: cantidadSolicitada,
        responsable: responsable,
        valor_unitario: insumo.valorUnitario,
        valor_total: cantidadSolicitada * Number.parseFloat(insumo.valorUnitario),
        observaciones: `Uso en asociación: ${nombreAsociacion}`,
        insumo: insumo.nombreInsumo,
      })
    }

    callback(null, { actualizaciones, registrosUso })
  })
}

// Función para ejecutar actualizaciones de insumos
function ejecutarActualizacionesInsumos(actualizaciones, callback) {
  let completadas = 0
  const errores = []

  if (actualizaciones.length === 0) {
    return callback(null)
  }

  actualizaciones.forEach((actualizacion) => {
    db.query(
      "UPDATE insumo SET cantidad = ?, valorTotal = ? WHERE idInsumo = ?",
      [actualizacion.nuevaCantidad, actualizacion.nuevoValorTotal, actualizacion.id],
      (err, result) => {
        completadas++

        if (err) {
          errores.push(err)
        }

        if (completadas === actualizaciones.length) {
          if (errores.length > 0) {
            callback(errores[0])
          } else {
            callback(null)
          }
        }
      },
    )
  })
}

// Función para registrar múltiples usos de insumos
function registrarMultiplesUsosInsumos(registrosUso, callback) {
  let completados = 0
  const errores = []

  if (registrosUso.length === 0) {
    return callback(null)
  }

  registrosUso.forEach((registro) => {
    db.query(
      "INSERT INTO uso_insumo (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        registro.fecha_uso,
        registro.cantidad,
        registro.responsable,
        registro.valor_unitario,
        registro.valor_total,
        registro.observaciones,
        registro.insumo,
      ],
      (err, result) => {
        completados++

        if (err) {
          errores.push(err)
        }

        if (completados === registrosUso.length) {
          if (errores.length > 0) {
            callback(errores[0])
          } else {
            callback(null)
          }
        }
      },
    )
  })
}

// Rutas para asociaciones actualizadas
router.get("/asociaciones", (req, res) => {
  db.query("SELECT * FROM asociaciones ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("Error al obtener asociaciones:", err)
      return res.status(500).json({ error: "Error al obtener asociaciones" })
    }
    res.json(results)
  })
})

router.get("/asociaciones/:id", (req, res) => {
  db.query("SELECT * FROM asociaciones WHERE id = ?", [req.params.id], (err, results) => {
    if (err) {
      console.error("Error al obtener asociación:", err)
      return res.status(500).json({ error: "Error al obtener asociación" })
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Asociación no encontrada" })
    }
    res.json(results[0])
  })
})

// Ruta POST actualizada para múltiples insumos
router.post("/asociaciones", (req, res) => {
  // Validar datos
  const errores = validarAsociacion(req.body)
  if (errores.length > 0) {
    return res.status(400).json({ errores })
  }

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
    insumos_detalle,
  } = req.body

  // Iniciar transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error al iniciar transacción:", err)
      return res.status(500).json({ error: "Error al iniciar transacción" })
    }

    // Procesar insumos
    procesarInsumosAsociacion(insumos_detalle, responsable, nombre_asociacion, (err, resultado) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error al procesar insumos:", err)
          res.status(400).json({ error: err.message })
        })
      }

      const { actualizaciones, registrosUso } = resultado

      // Insertar asociación
      db.query(
        "INSERT INTO asociaciones (responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
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
        ],
        (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error al crear asociación:", err)
              res.status(500).json({ error: "Error al crear asociación" })
            })
          }

          const asociacionId = result.insertId

          // Actualizar cantidades de insumos
          ejecutarActualizacionesInsumos(actualizaciones, (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error al actualizar cantidades de insumos:", err)
                res.status(500).json({ error: "Error al actualizar cantidades de insumos" })
              })
            }

            // Registrar usos de insumos
            registrarMultiplesUsosInsumos(registrosUso, (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error al registrar usos de insumos:", err)
                  res.status(500).json({ error: "Error al registrar usos de insumos" })
                })
              }

              // Confirmar transacción
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Error al confirmar transacción:", err)
                    res.status(500).json({ error: "Error al confirmar transacción" })
                  })
                }

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
                  mensaje: "Asociación creada correctamente con múltiples insumos",
                })
              })
            })
          })
        },
      )
    })
  })
})

// Ruta PUT actualizada para múltiples insumos
router.put("/asociaciones/:id", (req, res) => {
  // Validar datos
  const errores = validarAsociacion(req.body)
  if (errores.length > 0) {
    return res.status(400).json({ errores })
  }

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
    insumos_detalle,
  } = req.body

  // Iniciar transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error al iniciar transacción:", err)
      return res.status(500).json({ error: "Error al iniciar transacción" })
    }

    // Verificar que la asociación existe
    db.query("SELECT * FROM asociaciones WHERE id = ?", [req.params.id], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error al obtener asociación:", err)
          res.status(500).json({ error: "Error al obtener asociación" })
        })
      }

      if (results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: "Asociación no encontrada" })
        })
      }

      // Actualizar la asociación
      db.query(
        "UPDATE asociaciones SET responsable = ?, nombre_asociacion = ?, inversion = ?, meta = ?, iniico_produccion = ?, fin_produccion = ?, cultivo = ?, sensores = ?, insumos = ?, ciclo_cultivo = ? WHERE id = ?",
        [
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
          req.params.id,
        ],
        (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error al actualizar asociación:", err)
              res.status(500).json({ error: "Error al actualizar asociación" })
            })
          }

          // Si se proporcionan nuevos insumos, procesarlos
          if (insumos_detalle && insumos_detalle.length > 0) {
            procesarInsumosAsociacion(insumos_detalle, responsable, nombre_asociacion, (err, resultado) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error al procesar insumos:", err)
                  res.status(400).json({ error: err.message })
                })
              }

              const { actualizaciones, registrosUso } = resultado

              // Actualizar cantidades de insumos
              ejecutarActualizacionesInsumos(actualizaciones, (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Error al actualizar cantidades de insumos:", err)
                    res.status(500).json({ error: "Error al actualizar cantidades de insumos" })
                  })
                }

                // Registrar usos de insumos
                registrarMultiplesUsosInsumos(registrosUso, (err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error("Error al registrar usos de insumos:", err)
                      res.status(500).json({ error: "Error al registrar usos de insumos" })
                    })
                  }

                  // Confirmar transacción
                  db.commit((err) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error("Error al confirmar transacción:", err)
                        res.status(500).json({ error: "Error al confirmar transacción" })
                      })
                    }

                    res.json({
                      id: req.params.id,
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
                      mensaje: "Asociación actualizada correctamente con múltiples insumos",
                    })
                  })
                })
              })
            })
          } else {
            // Si no hay cambios en insumos, solo confirmar la transacción
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error al confirmar transacción:", err)
                  res.status(500).json({ error: "Error al confirmar transacción" })
                })
              }

              res.json({
                id: req.params.id,
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
                mensaje: "Asociación actualizada correctamente",
              })
            })
          }
        },
      )
    })
  })
})

// Ruta DELETE (sin cambios significativos)
router.delete("/asociaciones/:id", (req, res) => {
  // Iniciar transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error al iniciar transacción:", err)
      return res.status(500).json({ error: "Error al iniciar transacción" })
    }

    // Obtener la asociación para recuperar información
    db.query("SELECT * FROM asociaciones WHERE id = ?", [req.params.id], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error al obtener asociación:", err)
          res.status(500).json({ error: "Error al obtener asociación" })
        })
      }

      if (results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: "Asociación no encontrada" })
        })
      }

      // Eliminar la asociación
      db.query("DELETE FROM asociaciones WHERE id = ?", [req.params.id], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error al eliminar asociación:", err)
            res.status(500).json({ error: "Error al eliminar asociación" })
          })
        }

        // Confirmar transacción
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error al confirmar transacción:", err)
              res.status(500).json({ error: "Error al confirmar transacción" })
            })
          }

          res.json({
            message: "Asociación eliminada correctamente",
            id: req.params.id,
          })
        })
      })
    })
  })
})

// Las demás rutas permanecen igual (cultivo, ciclocultivo, sensores, insumo, responsables, uso-insumo)
// ... [resto del código sin cambios] ...

// Rutas para cultivos (sin cambios)
router.get("/cultivo", (req, res) => {
  db.query("SELECT * FROM cultivo", (err, results) => {
    if (err) {
      console.error("Error al obtener cultivos:", err)
      return res.status(500).json({ error: "Error al obtener cultivos" })
    }
    res.json(results)
  })
})

router.post("/cultivo", (req, res) => {
  // Validar datos
  const errores = validarCultivo(req.body)
  if (errores.length > 0) {
    return res.status(400).json({ errores })
  }

  const { cultivoType, cultivoName, cultivoID, size, location, description, state } = req.body

  // Verificar si ya existe un cultivo con el mismo ID
  db.query("SELECT * FROM cultivo WHERE cultivoID = ?", [cultivoID], (err, results) => {
    if (err) {
      console.error("Error al verificar cultivo:", err)
      return res.status(500).json({ error: "Error al verificar cultivo" })
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Ya existe un cultivo con este ID" })
    }

    db.query(
      "INSERT INTO cultivo (cultivoType, cultivoName, cultivoID, size, location, description, state) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [cultivoType, cultivoName, cultivoID, size, location, description, state],
      (err, result) => {
        if (err) {
          console.error("Error al crear cultivo:", err)
          return res.status(500).json({ error: "Error al crear cultivo" })
        }
        res.status(201).json({
          id: result.insertId,
          cultivoType,
          cultivoName,
          cultivoID,
          size,
          location,
          description,
          state,
          mensaje: "Cultivo creado correctamente",
        })
      },
    )
  })
})

// Rutas para ciclos de cultivo (sin cambios)
router.get("/ciclocultivo", (req, res) => {
  db.query("SELECT * FROM ciclocultivo", (err, results) => {
    if (err) {
      console.error("Error al obtener ciclos de cultivo:", err)
      return res.status(500).json({ error: "Error al obtener ciclos de cultivo" })
    }
    res.json(results)
  })
})

router.post("/ciclocultivo", (req, res) => {
  // Validar datos
  const errores = validarCiclo(req.body)
  if (errores.length > 0) {
    return res.status(400).json({ errores })
  }

  const { cicloID, cicloName, siembraDate, cosechaDate, news, description, state } = req.body

  db.query(
    "INSERT INTO ciclocultivo (cicloID, cicloName, siembraDate, cosechaDate, news, description, state) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [cicloID, cicloName, siembraDate, cosechaDate, news, description, state],
    (err, result) => {
      if (err) {
        console.error("Error al crear ciclo de cultivo:", err)
        return res.status(500).json({ error: "Error al crear ciclo de cultivo" })
      }
      res.status(201).json({
        id: result.insertId,
        cicloID,
        cicloName,
        siembraDate,
        cosechaDate,
        news,
        description,
        state,
        mensaje: "Ciclo de cultivo creado correctamente",
      })
    },
  )
})

// Rutas para sensores (sin cambios)
router.get("/sensores", (req, res) => {
  db.query("SELECT * FROM sensores", (err, results) => {
    if (err) {
      console.error("Error al obtener sensores:", err)
      return res.status(500).json({ error: "Error al obtener sensores" })
    }
    res.json(results)
  })
})

// Rutas para insumos (sin cambios)
router.get("/insumo", (req, res) => {
  db.query("SELECT * FROM insumo ORDER BY nombreInsumo", (err, results) => {
    if (err) {
      console.error("Error al obtener insumos:", err)
      return res.status(500).json({ error: "Error al obtener insumos" })
    }
    res.json(results)
  })
})

router.post("/insumo", (req, res) => {
  // Validar datos
  const errores = validarInsumo(req.body)
  if (errores.length > 0) {
    return res.status(400).json({ errores })
  }

  const { tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado } = req.body

  // Verificar si ya existe un insumo con el mismo nombre
  db.query("SELECT * FROM insumo WHERE nombreInsumo = ?", [nombreInsumo], (err, results) => {
    if (err) {
      console.error("Error al verificar insumo:", err)
      return res.status(500).json({ error: "Error al verificar insumo" })
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Ya existe un insumo con este nombre" })
    }

    db.query(
      "INSERT INTO insumo (tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado],
      (err, result) => {
        if (err) {
          console.error("Error al crear insumo:", err)
          return res.status(500).json({ error: "Error al crear insumo" })
        }
        res.status(201).json({
          idInsumo: result.insertId,
          tipoInsumo,
          nombreInsumo,
          unidadMedida,
          cantidad,
          valorUnitario,
          valorTotal,
          descripcion,
          estado,
          mensaje: "Insumo creado correctamente",
        })
      },
    )
  })
})

router.put("/insumo/:id", (req, res) => {
  // Validar datos
  const errores = validarInsumo(req.body)
  if (errores.length > 0) {
    return res.status(400).json({ errores })
  }

  const { tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado } = req.body

  // Verificar si existe el insumo
  db.query("SELECT * FROM insumo WHERE idInsumo = ?", [req.params.id], (err, results) => {
    if (err) {
      console.error("Error al verificar insumo:", err)
      return res.status(500).json({ error: "Error al verificar insumo" })
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Insumo no encontrado" })
    }

    // Verificar si el nuevo nombre ya existe en otro insumo
    db.query(
      "SELECT * FROM insumo WHERE nombreInsumo = ? AND idInsumo != ?",
      [nombreInsumo, req.params.id],
      (err, results) => {
        if (err) {
          console.error("Error al verificar nombre de insumo:", err)
          return res.status(500).json({ error: "Error al verificar nombre de insumo" })
        }

        if (results.length > 0) {
          return res.status(400).json({ error: "Ya existe otro insumo con este nombre" })
        }

        db.query(
          "UPDATE insumo SET tipoInsumo = ?, nombreInsumo = ?, unidadMedida = ?, cantidad = ?, valorUnitario = ?, valorTotal = ?, descripcion = ?, estado = ? WHERE idInsumo = ?",
          [
            tipoInsumo,
            nombreInsumo,
            unidadMedida,
            cantidad,
            valorUnitario,
            valorTotal,
            descripcion,
            estado,
            req.params.id,
          ],
          (err, result) => {
            if (err) {
              console.error("Error al actualizar insumo:", err)
              return res.status(500).json({ error: "Error al actualizar insumo" })
            }
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: "Insumo no encontrado" })
            }
            res.json({
              idInsumo: req.params.id,
              tipoInsumo,
              nombreInsumo,
              unidadMedida,
              cantidad,
              valorUnitario,
              valorTotal,
              descripcion,
              estado,
              mensaje: "Insumo actualizado correctamente",
            })
          },
        )
      },
    )
  })
})

// Ruta para obtener responsables
router.get("/responsables", (req, res) => {
  db.query(
    'SELECT id, name, email, phone, usertype FROM register WHERE usertype IN ("admin", "personal", "superadmin") ORDER BY name',
    (err, results) => {
      if (err) {
        console.error("Error al obtener responsables:", err)
        return res.status(500).json({ error: "Error al obtener responsables" })
      }
      res.json(results)
    },
  )
})

// Ruta para uso de insumos
router.post("/uso-insumo", (req, res) => {
  const { fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo } = req.body

  // Validaciones básicas
  if (!fecha_uso || !cantidad || !responsable || !valor_unitario || !valor_total || !insumo) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" })
  }

  if (isNaN(Number.parseFloat(cantidad)) || Number.parseFloat(cantidad) <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser un número positivo" })
  }

  if (isNaN(Number.parseFloat(valor_unitario)) || Number.parseFloat(valor_unitario) <= 0) {
    return res.status(400).json({ error: "El valor unitario debe ser un número positivo" })
  }

  if (isNaN(Number.parseFloat(valor_total)) || Number.parseFloat(valor_total) <= 0) {
    return res.status(400).json({ error: "El valor total debe ser un número positivo" })
  }

  db.query(
    "INSERT INTO uso_insumo (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo],
    (err, result) => {
      if (err) {
        console.error("Error al registrar uso de insumo:", err)
        return res.status(500).json({ error: "Error al registrar uso de insumo" })
      }
      res.status(201).json({
        id: result.insertId,
        fecha_uso,
        cantidad,
        responsable,
        valor_unitario,
        valor_total,
        observaciones,
        insumo,
        mensaje: "Uso de insumo registrado correctamente",
      })
    },
  )
})

// Ruta para obtener historial de uso de insumos
router.get("/uso-insumo", (req, res) => {
  db.query("SELECT * FROM uso_insumo ORDER BY fecha_uso DESC, id DESC", (err, results) => {
    if (err) {
      console.error("Error al obtener historial de uso de insumos:", err)
      return res.status(500).json({ error: "Error al obtener historial de uso de insumos" })
    }
    res.json(results)
  })
})

// Exportar el router
module.exports = router
