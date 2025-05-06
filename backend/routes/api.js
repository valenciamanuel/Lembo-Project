// Importar módulos necesarios
const mysql = require('mysql2');
const express = require('express');

const router = express.Router();

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'lembo',
  multipleStatements: true 
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Funciones de validación
function validarAsociacion(data) {
  const errores = [];
  
  // Validar campos obligatorios
  if (!data.responsable || data.responsable.trim() === '') {
    errores.push('El responsable es obligatorio');
  } else if (data.responsable.length > 30) {
    errores.push('El responsable no puede exceder los 30 caracteres');
  }
  
  if (!data.nombre_asociacion || data.nombre_asociacion.trim() === '') {
    errores.push('El nombre de la asociación es obligatorio');
  } else if (data.nombre_asociacion.length > 20) {
    errores.push('El nombre de la asociación no puede exceder los 20 caracteres');
  }
  
  if (!data.inversion || isNaN(parseFloat(data.inversion))) {
    errores.push('La inversión debe ser un número válido');
  } else if (parseFloat(data.inversion) <= 0) {
    errores.push('La inversión debe ser mayor que cero');
  }
  
  if (!data.meta || isNaN(parseFloat(data.meta))) {
    errores.push('La meta debe ser un número válido');
  } else if (parseFloat(data.meta) <= 0) {
    errores.push('La meta debe ser mayor que cero');
  }
  
  if (!data.iniico_produccion) {
    errores.push('La fecha de inicio de producción es obligatoria');
  }
  
  if (!data.fin_produccion) {
    errores.push('La fecha de fin de producción es obligatoria');
  }
  
  if (data.iniico_produccion && data.fin_produccion) {
    const inicio = new Date(data.iniico_produccion);
    const fin = new Date(data.fin_produccion);
    if (inicio > fin) {
      errores.push('La fecha de inicio no puede ser posterior a la fecha de fin');
    }
  }
  
  if (!data.cultivo || data.cultivo.trim() === '') {
    errores.push('El cultivo es obligatorio');
  }
  
  if (!data.sensores || data.sensores.trim() === '') {
    errores.push('Debe seleccionar al menos un sensor');
  }
  
  if (!data.insumos || data.insumos.trim() === '') {
    errores.push('Debe seleccionar un insumo');
  }
  
  if (!data.ciclo_cultivo || data.ciclo_cultivo.trim() === '') {
    errores.push('El ciclo de cultivo es obligatorio');
  }
  
  if (!data.cantidad_insumo || isNaN(parseFloat(data.cantidad_insumo))) {
    errores.push('La cantidad de insumo debe ser un número válido');
  } else if (parseFloat(data.cantidad_insumo) <= 0) {
    errores.push('La cantidad de insumo debe ser mayor que cero');
  }
  
  return errores;
}

function validarCultivo(data) {
  const errores = [];
  
  if (!data.cultivoType || data.cultivoType.trim() === '') {
    errores.push('El tipo de cultivo es obligatorio');
  }
  
  if (!data.cultivoName || data.cultivoName.trim() === '') {
    errores.push('El nombre del cultivo es obligatorio');
  }
  
  if (!data.cultivoID || data.cultivoID.trim() === '') {
    errores.push('El ID del cultivo es obligatorio');
  }
  
  if (!data.state || !['Activo', 'Inactivo'].includes(data.state)) {
    errores.push('El estado debe ser Activo o Inactivo');
  }
  
  return errores;
}

function validarCiclo(data) {
  const errores = [];
  
  if (!data.cicloID || data.cicloID.trim() === '') {
    errores.push('El ID del ciclo es obligatorio');
  }
  
  if (!data.cicloName || data.cicloName.trim() === '') {
    errores.push('El nombre del ciclo es obligatorio');
  }
  
  if (!data.siembraDate) {
    errores.push('La fecha de siembra es obligatoria');
  }
  
  if (!data.cosechaDate) {
    errores.push('La fecha de cosecha es obligatoria');
  }
  
  if (data.siembraDate && data.cosechaDate) {
    const siembra = new Date(data.siembraDate);
    const cosecha = new Date(data.cosechaDate);
    if (siembra > cosecha) {
      errores.push('La fecha de siembra no puede ser posterior a la fecha de cosecha');
    }
  }
  
  if (!data.state || !['activo', 'inactivo'].includes(data.state)) {
    errores.push('El estado debe ser activo o inactivo');
  }
  
  return errores;
}

function validarInsumo(data) {
  const errores = [];
  
  if (!data.tipoInsumo || data.tipoInsumo.trim() === '') {
    errores.push('El tipo de insumo es obligatorio');
  } else if (data.tipoInsumo.length > 20) {
    errores.push('El tipo de insumo no puede exceder los 20 caracteres');
  }
  
  if (!data.nombreInsumo || data.nombreInsumo.trim() === '') {
    errores.push('El nombre del insumo es obligatorio');
  } else if (data.nombreInsumo.length > 20) {
    errores.push('El nombre del insumo no puede exceder los 20 caracteres');
  }
  
  if (!data.unidadMedida || data.unidadMedida.trim() === '') {
    errores.push('La unidad de medida es obligatoria');
  } else if (data.unidadMedida.length > 10) {
    errores.push('La unidad de medida no puede exceder los 10 caracteres');
  }
  
  if (!data.cantidad || isNaN(parseFloat(data.cantidad))) {
    errores.push('La cantidad debe ser un número válido');
  } else if (parseFloat(data.cantidad) < 0) {
    errores.push('La cantidad no puede ser negativa');
  }
  
  if (!data.valorUnitario || isNaN(parseFloat(data.valorUnitario))) {
    errores.push('El valor unitario debe ser un número válido');
  } else if (parseFloat(data.valorUnitario) <= 0) {
    errores.push('El valor unitario debe ser mayor que cero');
  }
  
  if (!data.estado || !['activo', 'inactivo'].includes(data.estado)) {
    errores.push('El estado debe ser activo o inactivo');
  }
  
  return errores;
}

// Función para obtener insumo por nombre
function obtenerInsumoPorNombre(nombreInsumo, callback) {
  db.query('SELECT * FROM insumo WHERE nombreInsumo = ?', [nombreInsumo], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    callback(null, results[0]);
  });
}

// Función para actualizar la cantidad de insumo
function actualizarCantidadInsumo(idInsumo, cantidadUsada, callback) {
  db.query('SELECT * FROM insumo WHERE idInsumo = ?', [idInsumo], (err, results) => {
    if (err) {
      return callback(err);
    }
    
    if (results.length === 0) {
      return callback(new Error('Insumo no encontrado'));
    }
    
    const insumo = results[0];
    const nuevaCantidad = parseFloat(insumo.cantidad) - parseFloat(cantidadUsada);
    
    if (nuevaCantidad < 0) {
      return callback(new Error('No hay suficiente cantidad de insumo disponible'));
    }
    
    const valorTotal = nuevaCantidad * parseFloat(insumo.valorUnitario);
    
    db.query(
      'UPDATE insumo SET cantidad = ?, valorTotal = ? WHERE idInsumo = ?',
      [nuevaCantidad, valorTotal, idInsumo],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        callback(null);
      }
    );
  });
}

// Función para registrar el uso de insumo
function registrarUsoInsumo(data, callback) {
  db.query(
    'INSERT INTO uso_insumo (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.fecha_uso, data.cantidad, data.responsable, data.valor_unitario, data.valor_total, data.observaciones, data.insumo],
    (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.insertId);
    }
  );
}

// Rutas para asociaciones
router.get('/asociaciones', (req, res) => {
  db.query('SELECT * FROM asociaciones', (err, results) => {
    if (err) {
      console.error('Error al obtener asociaciones:', err);
      return res.status(500).json({ error: 'Error al obtener asociaciones' });
    }
    res.json(results);
  });
});

router.get('/asociaciones/:id', (req, res) => {
  db.query('SELECT * FROM asociaciones WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al obtener asociación:', err);
      return res.status(500).json({ error: 'Error al obtener asociación' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Asociación no encontrada' });
    }
    res.json(results[0]);
  });
});

router.post('/asociaciones', (req, res) => {
  // Validar datos
  const errores = validarAsociacion(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  
  const { responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo, cantidad_insumo } = req.body;
  
  // Iniciar transacción
  db.beginTransaction(err => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ error: 'Error al iniciar transacción' });
    }
    
    // Obtener información del insumo
    obtenerInsumoPorNombre(insumos, (err, insumo) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error al obtener insumo:', err);
          res.status(500).json({ error: 'Error al obtener insumo' });
        });
      }
      
      if (!insumo) {
        return db.rollback(() => {
          res.status(404).json({ error: 'Insumo no encontrado' });
        });
      }
      
      // Verificar si hay suficiente cantidad de insumo
      if (parseFloat(insumo.cantidad) < parseFloat(cantidad_insumo)) {
        return db.rollback(() => {
          res.status(400).json({ error: 'No hay suficiente cantidad de insumo disponible' });
        });
      }
      
      // Insertar asociación
      db.query(
        'INSERT INTO asociaciones (responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo],
        (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error al crear asociación:', err);
              res.status(500).json({ error: 'Error al crear asociación' });
            });
          }
          
          const asociacionId = result.insertId;
          
          // Actualizar cantidad de insumo
          actualizarCantidadInsumo(insumo.idInsumo, cantidad_insumo, err => {
            if (err) {
              return db.rollback(() => {
                console.error('Error al actualizar cantidad de insumo:', err);
                res.status(500).json({ error: 'Error al actualizar cantidad de insumo: ' + err.message });
              });
            }
            
            // Registrar uso de insumo
            const usoInsumoData = {
              fecha_uso: new Date().toISOString().split('T')[0],
              cantidad: cantidad_insumo,
              responsable: responsable,
              valor_unitario: insumo.valorUnitario,
              valor_total: parseFloat(cantidad_insumo) * parseFloat(insumo.valorUnitario),
              observaciones: `Uso en asociación: ${nombre_asociacion}`,
              insumo: insumos
            };
            
            registrarUsoInsumo(usoInsumoData, (err, usoId) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error al registrar uso de insumo:', err);
                  res.status(500).json({ error: 'Error al registrar uso de insumo' });
                });
              }
              
              // Confirmar transacción
              db.commit(err => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error al confirmar transacción:', err);
                    res.status(500).json({ error: 'Error al confirmar transacción' });
                  });
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
                  mensaje: 'Asociación creada correctamente y cantidad de insumo actualizada'
                });
              });
            });
          });
        }
      );
    });
  });
});

router.put('/asociaciones/:id', (req, res) => {
  // Validar datos
  const errores = validarAsociacion(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  
  const { responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo, cantidad_insumo } = req.body;
  
  // Iniciar transacción
  db.beginTransaction(err => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ error: 'Error al iniciar transacción' });
    }
    
    // Obtener la asociación actual para comparar insumos
    db.query('SELECT * FROM asociaciones WHERE id = ?', [req.params.id], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error al obtener asociación:', err);
          res.status(500).json({ error: 'Error al obtener asociación' });
        });
      }
      
      if (results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: 'Asociación no encontrada' });
        });
      }
      
      const asociacionActual = results[0];
      const insumoAnterior = asociacionActual.insumos;
      
      // Si el insumo cambió, necesitamos actualizar ambos insumos
      if (insumoAnterior !== insumos) {
        // Obtener información del nuevo insumo
        obtenerInsumoPorNombre(insumos, (err, nuevoInsumo) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error al obtener nuevo insumo:', err);
              res.status(500).json({ error: 'Error al obtener nuevo insumo' });
            });
          }
          
          if (!nuevoInsumo) {
            return db.rollback(() => {
              res.status(404).json({ error: 'Nuevo insumo no encontrado' });
            });
          }
          
          // Verificar si hay suficiente cantidad del nuevo insumo
          if (parseFloat(nuevoInsumo.cantidad) < parseFloat(cantidad_insumo)) {
            return db.rollback(() => {
              res.status(400).json({ error: 'No hay suficiente cantidad del nuevo insumo disponible' });
            });
          }
          
          // Obtener información del insumo anterior
          obtenerInsumoPorNombre(insumoAnterior, (err, insumoAnt) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error al obtener insumo anterior:', err);
                res.status(500).json({ error: 'Error al obtener insumo anterior' });
              });
            }
            
            // Actualizar la asociación
            db.query(
              'UPDATE asociaciones SET responsable = ?, nombre_asociacion = ?, inversion = ?, meta = ?, iniico_produccion = ?, fin_produccion = ?, cultivo = ?, sensores = ?, insumos = ?, ciclo_cultivo = ? WHERE id = ?',
              [responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo, req.params.id],
              (err, result) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error al actualizar asociación:', err);
                    res.status(500).json({ error: 'Error al actualizar asociación' });
                  });
                }
                
                // Actualizar cantidad del nuevo insumo (disminuir)
                actualizarCantidadInsumo(nuevoInsumo.idInsumo, cantidad_insumo, err => {
                  if (err) {
                    return db.rollback(() => {
                      console.error('Error al actualizar cantidad del nuevo insumo:', err);
                      res.status(500).json({ error: 'Error al actualizar cantidad del nuevo insumo: ' + err.message });
                    });
                  }
                  
                  // Si encontramos el insumo anterior, aumentar su cantidad
                  if (insumoAnt) {
                    // Aumentar la cantidad del insumo anterior
                    const nuevaCantidadAnterior = parseFloat(insumoAnt.cantidad) + parseFloat(cantidad_insumo);
                    const valorTotalAnterior = nuevaCantidadAnterior * parseFloat(insumoAnt.valorUnitario);
                    
                    db.query(
                      'UPDATE insumo SET cantidad = ?, valorTotal = ? WHERE idInsumo = ?',
                      [nuevaCantidadAnterior, valorTotalAnterior, insumoAnt.idInsumo],
                      (err, result) => {
                        if (err) {
                          return db.rollback(() => {
                            console.error('Error al actualizar cantidad del insumo anterior:', err);
                            res.status(500).json({ error: 'Error al actualizar cantidad del insumo anterior' });
                          });
                        }
                        
                        // Registrar uso del nuevo insumo
                        const usoInsumoData = {
                          fecha_uso: new Date().toISOString().split('T')[0],
                          cantidad: cantidad_insumo,
                          responsable: responsable,
                          valor_unitario: nuevoInsumo.valorUnitario,
                          valor_total: parseFloat(cantidad_insumo) * parseFloat(nuevoInsumo.valorUnitario),
                          observaciones: `Uso en asociación actualizada: ${nombre_asociacion}`,
                          insumo: insumos
                        };
                        
                        registrarUsoInsumo(usoInsumoData, (err, usoId) => {
                          if (err) {
                            return db.rollback(() => {
                              console.error('Error al registrar uso de insumo:', err);
                              res.status(500).json({ error: 'Error al registrar uso de insumo' });
                            });
                          }
                          
                          // Confirmar transacción
                          db.commit(err => {
                            if (err) {
                              return db.rollback(() => {
                                console.error('Error al confirmar transacción:', err);
                                res.status(500).json({ error: 'Error al confirmar transacción' });
                              });
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
                              mensaje: 'Asociación actualizada correctamente y cantidades de insumos actualizadas'
                            });
                          });
                        });
                      }
                    );
                  } else {
                    // Si no encontramos el insumo anterior, solo registramos el uso del nuevo
                    const usoInsumoData = {
                      fecha_uso: new Date().toISOString().split('T')[0],
                      cantidad: cantidad_insumo,
                      responsable: responsable,
                      valor_unitario: nuevoInsumo.valorUnitario,
                      valor_total: parseFloat(cantidad_insumo) * parseFloat(nuevoInsumo.valorUnitario),
                      observaciones: `Uso en asociación actualizada: ${nombre_asociacion}`,
                      insumo: insumos
                    };
                    
                    registrarUsoInsumo(usoInsumoData, (err, usoId) => {
                      if (err) {
                        return db.rollback(() => {
                          console.error('Error al registrar uso de insumo:', err);
                          res.status(500).json({ error: 'Error al registrar uso de insumo' });
                        });
                      }
                      
                      // Confirmar transacción
                      db.commit(err => {
                        if (err) {
                          return db.rollback(() => {
                            console.error('Error al confirmar transacción:', err);
                            res.status(500).json({ error: 'Error al confirmar transacción' });
                          });
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
                          mensaje: 'Asociación actualizada correctamente y cantidad de insumo actualizada'
                        });
                      });
                    });
                  }
                });
              }
            );
          });
        });
      } else {
        // Si el insumo no cambió, solo actualizamos la asociación
        db.query(
          'UPDATE asociaciones SET responsable = ?, nombre_asociacion = ?, inversion = ?, meta = ?, iniico_produccion = ?, fin_produccion = ?, cultivo = ?, sensores = ?, insumos = ?, ciclo_cultivo = ? WHERE id = ?',
          [responsable, nombre_asociacion, inversion, meta, iniico_produccion, fin_produccion, cultivo, sensores, insumos, ciclo_cultivo, req.params.id],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error al actualizar asociación:', err);
                res.status(500).json({ error: 'Error al actualizar asociación' });
              });
            }
            
            // Confirmar transacción
            db.commit(err => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error al confirmar transacción:', err);
                  res.status(500).json({ error: 'Error al confirmar transacción' });
                });
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
                mensaje: 'Asociación actualizada correctamente'
              });
            });
          }
        );
      }
    });
  });
});

router.delete('/asociaciones/:id', (req, res) => {
  // Iniciar transacción
  db.beginTransaction(err => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ error: 'Error al iniciar transacción' });
    }
    
    // Obtener la asociación para recuperar el insumo
    db.query('SELECT * FROM asociaciones WHERE id = ?', [req.params.id], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error al obtener asociación:', err);
          res.status(500).json({ error: 'Error al obtener asociación' });
        });
      }
      
      if (results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: 'Asociación no encontrada' });
        });
      }
      
      const asociacion = results[0];
      
      // Eliminar la asociación
      db.query('DELETE FROM asociaciones WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error al eliminar asociación:', err);
            res.status(500).json({ error: 'Error al eliminar asociación' });
          });
        }
        
        // Confirmar transacción
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              console.error('Error al confirmar transacción:', err);
              res.status(500).json({ error: 'Error al confirmar transacción' });
            });
          }
          
          res.json({
            message: 'Asociación eliminada correctamente',
            id: req.params.id
          });
        });
      });
    });
  });
});

// Rutas para cultivos
router.get('/cultivo', (req, res) => {
  db.query('SELECT * FROM cultivo', (err, results) => {
    if (err) {
      console.error('Error al obtener cultivos:', err);
      return res.status(500).json({ error: 'Error al obtener cultivos' });
    }
    res.json(results);
  });
});

router.post('/cultivo', (req, res) => {
  // Validar datos
  const errores = validarCultivo(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  
  const { cultivoType, cultivoName, cultivoID, size, location, description, state } = req.body;
  
  // Verificar si ya existe un cultivo con el mismo ID
  db.query('SELECT * FROM cultivo WHERE cultivoID = ?', [cultivoID], (err, results) => {
    if (err) {
      console.error('Error al verificar cultivo:', err);
      return res.status(500).json({ error: 'Error al verificar cultivo' });
    }
    
    if (results.length > 0) {
      return res.status(400).json({ error: 'Ya existe un cultivo con este ID' });
    }
    
    db.query(
      'INSERT INTO cultivo (cultivoType, cultivoName, cultivoID, size, location, description, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cultivoType, cultivoName, cultivoID, size, location, description, state],
      (err, result) => {
        if (err) {
          console.error('Error al crear cultivo:', err);
          return res.status(500).json({ error: 'Error al crear cultivo' });
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
          mensaje: 'Cultivo creado correctamente'
        });
      }
    );
  });
});

// Rutas para ciclos de cultivo
router.get('/ciclocultivo', (req, res) => {
  db.query('SELECT * FROM ciclocultivo', (err, results) => {
    if (err) {
      console.error('Error al obtener ciclos de cultivo:', err);
      return res.status(500).json({ error: 'Error al obtener ciclos de cultivo' });
    }
    res.json(results);
  });
});

router.post('/ciclocultivo', (req, res) => {
  // Validar datos
  const errores = validarCiclo(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  
  const { cicloID, cicloName, siembraDate, cosechaDate, news, description, state } = req.body;
  
  db.query(
    'INSERT INTO ciclocultivo (cicloID, cicloName, siembraDate, cosechaDate, news, description, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [cicloID, cicloName, siembraDate, cosechaDate, news, description, state],
    (err, result) => {
      if (err) {
        console.error('Error al crear ciclo de cultivo:', err);
        return res.status(500).json({ error: 'Error al crear ciclo de cultivo' });
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
        mensaje: 'Ciclo de cultivo creado correctamente'
      });
    }
  );
});

// Rutas para sensores
router.get('/sensores', (req, res) => {
  db.query('SELECT * FROM sensores', (err, results) => {
    if (err) {
      console.error('Error al obtener sensores:', err);
      return res.status(500).json({ error: 'Error al obtener sensores' });
    }
    res.json(results);
  });
});

// Rutas para insumos
router.get('/insumo', (req, res) => {
  db.query('SELECT * FROM insumo', (err, results) => {
    if (err) {
      console.error('Error al obtener insumos:', err);
      return res.status(500).json({ error: 'Error al obtener insumos' });
    }
    res.json(results);
  });
});

router.post('/insumo', (req, res) => {
  // Validar datos
  const errores = validarInsumo(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  
  const { tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado } = req.body;
  
  // Verificar si ya existe un insumo con el mismo nombre
  db.query('SELECT * FROM insumo WHERE nombreInsumo = ?', [nombreInsumo], (err, results) => {
    if (err) {
      console.error('Error al verificar insumo:', err);
      return res.status(500).json({ error: 'Error al verificar insumo' });
    }
    
    if (results.length > 0) {
      return res.status(400).json({ error: 'Ya existe un insumo con este nombre' });
    }
    
    db.query(
      'INSERT INTO insumo (tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado],
      (err, result) => {
        if (err) {
          console.error('Error al crear insumo:', err);
          return res.status(500).json({ error: 'Error al crear insumo' });
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
          mensaje: 'Insumo creado correctamente'
        });
      }
    );
  });
});

router.put('/insumo/:id', (req, res) => {
  // Validar datos
  const errores = validarInsumo(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  
  const { tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado } = req.body;
  
  // Verificar si existe el insumo
  db.query('SELECT * FROM insumo WHERE idInsumo = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al verificar insumo:', err);
      return res.status(500).json({ error: 'Error al verificar insumo' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    
    // Verificar si el nuevo nombre ya existe en otro insumo
    db.query('SELECT * FROM insumo WHERE nombreInsumo = ? AND idInsumo != ?', [nombreInsumo, req.params.id], (err, results) => {
      if (err) {
        console.error('Error al verificar nombre de insumo:', err);
        return res.status(500).json({ error: 'Error al verificar nombre de insumo' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Ya existe otro insumo con este nombre' });
      }
      
      db.query(
        'UPDATE insumo SET tipoInsumo = ?, nombreInsumo = ?, unidadMedida = ?, cantidad = ?, valorUnitario = ?, valorTotal = ?, descripcion = ?, estado = ? WHERE idInsumo = ?',
        [tipoInsumo, nombreInsumo, unidadMedida, cantidad, valorUnitario, valorTotal, descripcion, estado, req.params.id],
        (err, result) => {
          if (err) {
            console.error('Error al actualizar insumo:', err);
            return res.status(500).json({ error: 'Error al actualizar insumo' });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
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
            mensaje: 'Insumo actualizado correctamente'
          });
        }
      );
    });
  });
});

// Ruta para obtener responsables
router.get('/responsables', (req, res) => {
    db.query('SELECT * FROM register ORDER BY name', (err, results) => {
      if (err) {
        console.error('Error al obtener responsables:', err);
        return res.status(500).json({ error: 'Error al obtener responsables' });
      }
      res.json(results);
    });
  });
  
  // Ruta para crear un nuevo responsable
  router.post('/responsables', (req, res) => {
    const errores = validarResponsable(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }
    
    const { nombre } = req.body;
    
    // Verificar si ya existe un responsable con el mismo nombre
    db.query('SELECT * FROM responsables WHERE nombre = ?', [nombre], (err, results) => {
      if (err) {
        console.error('Error al verificar responsable:', err);
        return res.status(500).json({ error: 'Error al verificar responsable' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Ya existe un responsable con este nombre' });
      }
      
      db.query(
        'INSERT INTO responsables (nombre) VALUES (?)',
        [nombre],
        (err, result) => {
          if (err) {
            console.error('Error al crear responsable:', err);
            return res.status(500).json({ error: 'Error al crear responsable' });
          }
          res.status(201).json({
            id: result.insertId,
            nombre,
            mensaje: 'Responsable creado correctamente'
          });
        }
      );
    });
  });
  
// Ruta para uso de insumos
router.post('/uso-insumo', (req, res) => {
  const { fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo } = req.body;
  
  // Validaciones básicas
  if (!fecha_uso || !cantidad || !responsable || !valor_unitario || !valor_total || !insumo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  
  if (isNaN(parseFloat(cantidad)) || parseFloat(cantidad) <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
  }
  
  if (isNaN(parseFloat(valor_unitario)) || parseFloat(valor_unitario) <= 0) {
    return res.status(400).json({ error: 'El valor unitario debe ser un número positivo' });
  }
  
  if (isNaN(parseFloat(valor_total)) || parseFloat(valor_total) <= 0) {
    return res.status(400).json({ error: 'El valor total debe ser un número positivo' });
  }
  
  db.query(
    'INSERT INTO uso_insumo (fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [fecha_uso, cantidad, responsable, valor_unitario, valor_total, observaciones, insumo],
    (err, result) => {
      if (err) {
        console.error('Error al registrar uso de insumo:', err);
        return res.status(500).json({ error: 'Error al registrar uso de insumo' });
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
        mensaje: 'Uso de insumo registrado correctamente'
      });
    }
  );
});

// Exportar el router y la conexión a la base de datos
module.exports = router;
