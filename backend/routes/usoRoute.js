const express = require('express');
const router = express.Router();
const{ insertarUso } = require('../controllers/usoController');

router.post('/', insertarUso);

module.exports = router;