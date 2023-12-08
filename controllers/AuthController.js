// controllers/AuthController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId, email) => {
    return jwt.sign({ userId, email }, 'your-secret-key', {
        expiresIn: '1h',
    });
};

const AuthController = {

    getAllAuthUsers: async (req, res) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized: Missing token' });
            }
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    registerUser: async (req, res) => {
        try {
            const { username, password, email, user_type } = req.body;

            // Basic validation
            if (!username || !password || !email || !user_type) {
                return res.status(400).json({ error: 'Invalid input. All fields are required.' });
            }

            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate a JWT token for the new user
            const token = generateToken(username, email); // You can customize the token payload as needed

            // Create a new user with the hashed password and user_type
            const newUser = await User.create({ username, password: hashedPassword, email, user_type, token });

            res.status(201).json({ user: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Basic validation
            if (!email || !password) {
                return res.status(400).json({ error: 'Invalid input. Email and password are required.' });
            }

            // Check if the user with the provided email exists
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            // Check if the password is correct
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            // Generate a JWT token for the authenticated user
            const token = generateToken(user.id, user.email);

            res.json({ user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const { username, password, email, user_type } = req.body;

            // Basic validation
            if (!username || !password || !email || !user_type) {
                return res.status(400).json({ error: 'Invalid input. All fields are required.' });
            }

            // Check if the user exists
            const existingUser = await User.findByPk(userId);
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Hash the new password before updating it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the user with the hashed password and user_type
            const updatedUser = await existingUser.update({
                username,
                password: hashedPassword,
                email,
                user_type,
            });

            res.json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;

            // Check if the user exists
            const existingUser = await User.findByPk(userId);
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Delete the user
            await existingUser.destroy();

            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = AuthController;
