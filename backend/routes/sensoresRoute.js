const express = require('express');
const router = express.Router();
const { insertarSensor } = require('../controllers/sensorController.js');

router.post('/', insertarSensor);

module.exports = router;
