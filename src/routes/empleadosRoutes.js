const express = require('express') 
const {getEmpleados, createEmpleado, editEmpleado} = require('../controllers/empleaados.js')
const router = express.Router();

router.get("/", getEmpleados) // Assuming you have an initialData function in auth.js
router.post("/", createEmpleado);
router.put("/", editEmpleado);

module.exports = router;