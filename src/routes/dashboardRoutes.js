const express = require('express') 
const { InitialData} = require('../controllers/dashboard.js')
const router = express.Router();

router.post("/initial-data", InitialData) // Assuming you have an initialData function in auth.js

module.exports = router;