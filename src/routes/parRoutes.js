const express = require('express') 
const { getPar } = require('../controllers/par.js');
const router = express.Router();

router.get("/:par", getPar) // Assuming you have an initialData function in auth.js

module.exports = router;