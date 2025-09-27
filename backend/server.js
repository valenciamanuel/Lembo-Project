const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");

// --- Configuración CORS ---
app.use(cors({
    origin: ["http://localhost:5501", "http://127.0.0.1:5501"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors());

// Middleware para servir archivos estáticos públicos (CSS, JS, imágenes generales del frontend)
// Esto permite acceder a '/fronted/public/js/...' directamente desde '/'
app.use(express.static(path.join(__dirname, '..', 'fronted', 'public')));

// ✅ CORRECCIÓN CLAVE: Middleware específico para servir la carpeta 'uploads'
// Esto APUNTA A LA RAÍZ del proyecto, donde Multer guarda los archivos.
// Ahora, si el frontend pide http://localhost:3000/uploads/imagen.jpg, funcionará.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"))); 


// RUTA DE PRUEBA:
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Conexión exitosa, sin DB' });
});

// Importación de rutas
const cicloCultivoRoutes = require('./routes/cicloCultivoRoutes.js');
const cultivoRoutes = require('./routes/cultivoRoute.js');
const insumoRoutes = require('./routes/insumoRoute.js');
const sensorRoutes = require('./routes/sensoresRoute.js');
const regsiterRoutes = require('./routes/registerRoute.js');
const asociacionRoutes = require('./routes/asociacionRoute.js');
const usoRoutes = require('./routes/usoRoute.js');
const asociacionListRoutes = require('./routes/asociacionListRoute.js');
const asociacionDetalleRoute = require('./routes/asociacionDetalleRoute.js');
const apiasociaciones = require('./routes/api.js');

// Uso de rutas
app.use('/ciclocultivo', cicloCultivoRoutes);
app.use('/cultivo', cultivoRoutes);
app.use('/insumo', insumoRoutes);
app.use('/sensores', sensorRoutes);
app.use('/register', regsiterRoutes);
app.use('/asociaciones', asociacionRoutes);
app.use('/uso_insumo', usoRoutes);
app.use('/asociaciones/listar', asociacionListRoutes);
app.use('/asociaciones', asociacionDetalleRoute);
app.use('/api', apiasociaciones);

app.listen(3000, () => {
    console.log('✅ Server is running on port 3000');
});
