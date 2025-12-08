const express = require('express') 
const {getDepartamentos} = require('../controllers/dep.js')
const router = express.Router();

router.get("/", getDepartamentos) // Assuming you have an initialData function in auth.js

module.exports = router;