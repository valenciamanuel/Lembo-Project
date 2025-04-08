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

app .use('/ciclocultivo', cicloCultivoRoutes);
app .use('/cultivo', cultivoRoutes);
app .use('/insumo', insumoRoutes);
app .use('/sensores', sensorRoutes); 
app .use('/register',regsiterRoutes)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});