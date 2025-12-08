const express = require('express') 
const { createAutoevaluacion } = require('../controllers/autoevaluacion.js');
const router = express.Router();

router.post("/", createAutoevaluacion) // Assuming you have an initialData function in auth.js

module.exports = router;