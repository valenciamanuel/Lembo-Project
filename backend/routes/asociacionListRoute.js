const express = require("express")
const router = express.Router()
const { insertarAsociacion, actualizarAsociacion, eliminarAsociacion } = require("../controllers/asociacionController")
const pool = require("../config/db.js")

// Ruta para listar todas las asociaciones
router.get("/", async (req, res) => {
  try {
    const [asociaciones] = await pool.query("SELECT * FROM asociaciones ORDER BY id DESC")
    res.json(asociaciones)
  } catch (error) {
    console.error("Error al obtener asociaciones:", error)
    res.status(500).json({ error: "Error al obtener asociaciones" })
  }
})

// Ruta para obtener una asociación específica
router.get("/:id", async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "ID no proporcionado" })
  }

  try {
    const [rows] = await pool.query("SELECT * FROM asociaciones WHERE id = ?", [id])

    if (rows.length === 0) {
      return res.status(404).json({ error: "Asociación no encontrada" })
    }

    res.json(rows[0])
  } catch (error) {
    console.error("Error al obtener la asociación:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// Ruta para insertar una nueva asociación
router.post("/", insertarAsociacion)

// Ruta para actualizar una asociación
router.put("/:id", actualizarAsociacion)

// Ruta para eliminar una asociación
router.delete("/:id", eliminarAsociacion)

// Ruta para obtener estadísticas de asociaciones
router.get("/stats/resumen", async (req, res) => {
  try {
    const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as total_asociaciones,
                SUM(inversion) as inversion_total,
                SUM(meta) as meta_total,
                AVG(inversion) as inversion_promedio,
                AVG(meta) as meta_promedio
            FROM asociaciones
        `)

    const [cultivosStats] = await pool.query(`
            SELECT 
                cultivo,
                COUNT(*) as cantidad,
                SUM(inversion) as inversion_cultivo
            FROM asociaciones 
            GROUP BY cultivo
            ORDER BY cantidad DESC
        `)

    res.json({
      resumen: stats[0],
      por_cultivo: cultivosStats,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ error: "Error al obtener estadísticas" })
  }
})

module.exports = router
