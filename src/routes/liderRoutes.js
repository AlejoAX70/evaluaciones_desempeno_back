const express = require('express'); 
const { getLider } = require('../controllers/lider');

const router = express.Router();

router.get("/:lider", getLider) // Assuming you have an initialData function in auth.js

module.exports = router;