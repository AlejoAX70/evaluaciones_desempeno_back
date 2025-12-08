const express = require('express'); 
const { getAllresults, deleteResult } = require('../controllers/results');

const router = express.Router();
router.get("/", getAllresults)
router.delete("/:id", deleteResult)


module.exports = router;