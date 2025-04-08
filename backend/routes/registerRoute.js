const express = require('express');
const router = express.Router();
const { insertarRegister } = require('../controllers/registerController.js');

router.post('/', insertarRegister);

module.exports = router;
