const { DataTypes, Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.development);

const User = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    budget_proposal_amount: {
        type: DataTypes.STRING, // Change the data type to STRING
        allowNull: true,
        defaultValue: '',
    },
    budget_proposal_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    budget_proposal_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '', // Default to an empty string
    },
    budget_proposal_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
});

module.exports = User;
