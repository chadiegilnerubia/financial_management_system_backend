const express = require('express');
const router = express.Router();
const budgetProposalController = require('../controllers/BudgetProposalController');

// Create a new budget proposal for a specific user
router.post('/user/:userId/budget-proposal', budgetProposalController.createBudgetProposal);

// Get all budget proposals for a specific user
router.get('/user/:userId/budget-proposal', budgetProposalController.getAllBudgetProposals);

// Approve a budget proposal by ID for a specific user
router.put('/user/:userId/budget-proposal/approve/:id', budgetProposalController.approveBudget);

// Get a single budget proposal by ID for a specific user
router.get('/user/:userId/budget-proposal/:id', budgetProposalController.getBudgetProposalById);

// Update a budget proposal by ID for a specific user
router.put('/user/:userId/budget-proposal/:id', budgetProposalController.updateBudgetProposal);

// Delete a budget proposal by ID for a specific user
router.delete('/user/:userId/budget-proposal/:id', budgetProposalController.deleteBudgetProposal);

module.exports = router;
