const  express = require('express');
const router = express.Router();
const { insertarCultivo } = require('../controllers/cultivoController.js');

router.post('/', insertarCultivo);

module.exports = router;