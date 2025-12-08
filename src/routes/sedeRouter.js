const express = require('express') 
const {getSedes} = require('../controllers/sede.js')
const router = express.Router();

router.get("/", getSedes) // Assuming you have an initialData function in auth.js

module.exports = router;