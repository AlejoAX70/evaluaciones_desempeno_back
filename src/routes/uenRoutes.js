const express = require('express') 
const {getUen} = require('../controllers/uen.js')
const router = express.Router();

router.get("/", getUen) // Assuming you have an initialData function in auth.js

module.exports = router;