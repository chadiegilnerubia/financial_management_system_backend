// models/IncomeStatement.js
const { DataTypes, Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.development);
const IncomeStatement = sequelize.define('income_statements', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    revenue: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    total_income: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    income_tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    net_income: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    submitter: {
        type: DataTypes.STRING(125),
        allowNull: true,
    },
    position: {
        type: DataTypes.STRING(125),
        allowNull: true,
    },
});

module.exports = IncomeStatement;
