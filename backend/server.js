const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const cicloCultivoRoutes = require('./routes/cicloCultivoRoutes.js');
const cultivoRoutes = require('./routes/cultivoRoute.js');
const insumoRoutes = require('./routes/insumoRoute.js');
const sensorRoutes = require('./routes/sensoresRoute.js');
const regsiterRoutes = require('./routes/registerRoute.js');
const asociacionRoutes = require('./routes/asociacionRoute.js');
const usoRoutes = require('./routes/usoRoute.js');
const asociacionListRoutes = require('./routes/asociacionListRoute.js'); 
const asociacionDetalleRoute = require('./routes/asociacionDetalleRoute.js');

app.use('/ciclocultivo', cicloCultivoRoutes);
app.use('/cultivo', cultivoRoutes);
app.use('/insumo', insumoRoutes);
app.use('/sensores', sensorRoutes); 
app.use('/register', regsiterRoutes);
app.use('/asociaciones', asociacionRoutes);
app.use('/uso_insumo', usoRoutes);
app.use('/asociaciones/listar', asociacionListRoutes); 
app.use('/asociaciones', asociacionDetalleRoute);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
