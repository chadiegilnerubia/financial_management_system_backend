const express = require('express');
const { Sequelize } = require('sequelize');
const config = require('./config');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const budgetProposalRoutes = require('./routes/budgetProposalRoutes');
const incomeStatementRoute = require('./routes/incomeStatementRoutes');
const sequelize = new Sequelize(config.development);
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const PORT = process.env.PORT || 3005;

const corsOptions = {
    origin: 'http://localhost:3000', // Adjust to your React app's origin
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Add a middleware to pass io to the routes
app.use((req, res, next) => {
    console.log("Middleware executed");
    req.io = io;
    next();
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/proposals', budgetProposalRoutes);
app.use('/income-statements', incomeStatementRoute);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Additional log for debugging
    socket.on('newBudgetProposal', (newPost) => {
        console.log('New budget proposal received on the server:', newPost);
        io.emit('newBudgetProposal', newPost);
        console.log('WebSocket event emitted successfully on the server:', newPost);
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
