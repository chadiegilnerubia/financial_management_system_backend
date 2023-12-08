// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Define routes for user authentication
router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.put('/update/:id', AuthController.updateUser);
router.delete('/delete/:id', AuthController.deleteUser);
router.get('/users', AuthController.getAllAuthUsers);

module.exports = router;
