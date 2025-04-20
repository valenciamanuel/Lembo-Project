const express = require('express');
const router = express.Router();
const{ insertarAsociacion } = require('../controllers/asociacionController');

router.post('/', insertarAsociacion);

module.exports = router;