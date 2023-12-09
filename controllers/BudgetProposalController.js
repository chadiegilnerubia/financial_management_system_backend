// controllers/BudgetProposalController.js
const BudgetProposal = require('../models/BudgetProposal');

const BudgetProposalController = {
    createBudgetProposal: async (req, res) => {
        try {
            const { userId } = req.params; // Extract user ID from URL parameters
            const { budget_proposal_amount, budget_proposal_description, budget_proposal_name } = req.body;

            const newBudgetProposal = await BudgetProposal.create({
                user_id: userId, // Use the extracted user ID
                budget_proposal_amount,
                budget_proposal_description,
                budget_proposal_name,
                budget_proposal_status: false, // Assuming the default status is false
            });
            console.log('id', userId)
            res.status(201).json(newBudgetProposal);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getAllBudgetProposals: async (req, res) => {
        try {
            const budgetProposals = await BudgetProposal.findAll();
            res.json(budgetProposals);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getBudgetProposalById: async (req, res) => {
        const { id } = req.params;
        try {
            const budgetProposal = await BudgetProposal.findByPk(id);
            if (budgetProposal) {
                res.json(budgetProposal);
            } else {
                res.status(404).json({ error: 'Budget proposal not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateBudgetProposal: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedBudgetProposal = await BudgetProposal.update(req.body, {
                where: { id },
            });
            if (updatedBudgetProposal[0] === 1) {
                res.json({ message: 'Budget proposal updated successfully' });
            } else {
                res.status(404).json({ error: 'Budget proposal not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteBudgetProposal: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedRows = await BudgetProposal.destroy({
                where: { id },
            });
            if (deletedRows === 1) {
                res.json({ message: 'Budget proposal deleted successfully' });
            } else {
                res.status(404).json({ error: 'Budget proposal not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    approveBudget: async (req, res) => {
        try {
            const budgetId = req.params.id;
            console.log("budgetID", budgetId)
            // Check if the budget exists
            const existingBudget = await BudgetProposal.findByPk(budgetId);
            if (!existingBudget) {
                return res.status(404).json({ error: 'Budget not found' });
            }

            // Update the budget status to true (approved)
            const updateFields = {
                budget_proposal_status: true,
            };

            const updatedBudget = await existingBudget.update(updateFields);

            res.json(updatedBudget);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

};

module.exports = BudgetProposalController;
