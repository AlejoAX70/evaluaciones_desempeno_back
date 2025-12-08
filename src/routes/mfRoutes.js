const express = require('express') 
const {getMfs, getOneMf, getAllOfMfs, createMf, editMf} = require('../controllers/mf.js')
const router = express.Router();

router.get("/", getMfs) // Assuming you have an initialData function in auth.js

router.get("/all", getAllOfMfs) // Assuming you have an initialData function in auth.js

router.get("/:mf", getOneMf) // Assuming you have an initialData function in auth.js

router.post("/", createMf) // Assuming you have an initialData function in auth.js

router.put("/", editMf) // Assuming you have an initialData function in auth.js

module.exports = router;