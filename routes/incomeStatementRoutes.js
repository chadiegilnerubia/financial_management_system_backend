// routes/incomeStatementRoutes.js
const express = require('express');
const router = express.Router();
const IncomeStatementController = require('../controllers/IncomeStatementController');

// Define routes for managing income statements
router.post('/', IncomeStatementController.createIncomeStatement);
router.get('/', IncomeStatementController.getAllIncomeStatements);
router.get('/:id', IncomeStatementController.getIncomeStatementById);
router.put('/:id', IncomeStatementController.updateIncomeStatement);
router.delete('/:id', IncomeStatementController.deleteIncomeStatement);

module.exports = router;
