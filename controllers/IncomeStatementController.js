// controllers/IncomeStatementController.js
const IncomeStatement = require('../models/IncomeStatement');

const IncomeStatementController = {
    createIncomeStatement: async (req, res) => {
        try {
            // Assuming that user_id is part of the request body
            const { user_id, ...incomeStatementData } = req.body;

            // Add user_id to the incomeStatementData
            incomeStatementData.user_id = user_id;

            const incomeStatement = await IncomeStatement.create(incomeStatementData);
            return res.status(201).json(incomeStatement);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAllIncomeStatements: async (req, res) => {
        try {
            const incomeStatements = await IncomeStatement.findAll();
            console.log("-----------", incomeStatements)
            return res.status(200).json(incomeStatements);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getIncomeStatementById: async (req, res) => {
        const incomeStatementId = req.params.id;

        try {
            const incomeStatement = await IncomeStatement.findByPk(incomeStatementId);

            if (!incomeStatement) {
                return res.status(404).json({ error: 'Income Statement not found' });
            }

            return res.status(200).json(incomeStatement);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateIncomeStatement: async (req, res) => {
        const incomeStatementId = req.params.id;

        try {
            const incomeStatement = await IncomeStatement.findByPk(incomeStatementId);

            if (!incomeStatement) {
                return res.status(404).json({ error: 'Income Statement not found' });
            }

            await incomeStatement.update(req.body);

            return res.status(200).json(incomeStatement);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteIncomeStatement: async (req, res) => {
        const incomeStatementId = req.params.id;

        try {
            const incomeStatement = await IncomeStatement.findByPk(incomeStatementId);

            if (!incomeStatement) {
                return res.status(404).json({ error: 'Income Statement not found' });
            }

            await incomeStatement.destroy();

            return res.status(200).json({ message: 'Income Statement deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = IncomeStatementController;
