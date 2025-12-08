const express = require('express') 
const { getAllLogins, createUser, editUser } = require('../controllers/users.js');
const router = express.Router();

router.get("/", getAllLogins) // Assuming you have an initialData function in auth.js
router.post("/", createUser);
router.put("/", editUser);

module.exports = router;