const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path"); // ✅ 1. IMPORTAR PATH AL INICIO

app.use(cors({
    origin: ["http://localhost:5501", "http://127.0.0.1:5501"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ 2. AGREGAR ESTA LÍNEA PARA PROCESAR FORMULARIOS
app.options('*', cors());

// ✅ 3. DESCOMENTAR Y AJUSTAR LA RUTA PARA SERVIR LA CARPETA 'uploads'
app.use("/uploads", express.static(path.resolve(__dirname, "..", "fronted", "public", "uploads")));

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