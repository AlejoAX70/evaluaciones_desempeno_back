const express = require('express'); 
const { getCompetencias, createComp, editComp } = require('../controllers/competencias');

const router = express.Router();
router.get("/", getCompetencias)
router.post("/", createComp)
router.put("/", editComp)

module.exports = router;
