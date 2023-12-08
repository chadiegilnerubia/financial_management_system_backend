// server.js
const express = require('express');
const { Sequelize } = require('sequelize');
const config = require('./config');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const budgetProposalRoutes = require('./routes/budgetProposalRoutes'); // Import budget proposal routes
const sequelize = new Sequelize(config.development);
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/proposals', budgetProposalRoutes); // Use budget proposal routes under '/proposals'

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
