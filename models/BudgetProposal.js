// models/BudgetProposal.js
const { DataTypes, Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.development);
const BudgetProposal = sequelize.define('budget_proposal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    budget_proposal_amount: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    budget_proposal_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    budget_proposal_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    budget_proposal_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

module.exports = BudgetProposal;
