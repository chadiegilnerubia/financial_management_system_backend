// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Define routes for managing users
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.post('/login', UserController.loginUser);

// New routes for managing budgets
router.post('/:userId/budget', UserController.createBudget);
router.put('/:userId/budget/', UserController.updateBudget);
router.delete('/:userId/budget/:budgetId', UserController.deleteBudget);
router.put('/:userId/budget/:budgetId/notapprove', UserController.notApproveBudget);
router.put('/:userId/budget/:budgetId/approve', UserController.approveBudget);

module.exports = router;
