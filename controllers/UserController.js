// controllers/UserController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUserById: async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createUser: async (req, res) => {
        try {
            const {
                username,
                password,
                email,
                role,
            } = req.body;

            // Basic validation (you should implement more robust validation)
            if (!username || !password || !email || !role) {
                return res.status(400).json({ error: 'Invalid input. All fields are required.' });
            }

            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Check if the user with the same email already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists.' });
            }

            // Create a new user with the hashed password and additional attributes
            const newUser = await User.create({
                username,
                password: hashedPassword,
                email,
                role,
            });

            res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    registerUser: async (req, res) => {
        try {
            const { username, password, email } = req.body;

            // Basic validation
            if (!username || !password || !email) {
                return res.status(400).json({ error: 'Invalid input. All fields are required.' });
            }

            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Check if the user with the same email already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists.' });
            }

            // Create a new user with the hashed password
            const newUser = await User.create({ username, password: hashedPassword, email });

            res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ error: 'Invalid input. Email and password are required.' });
            }

            // Find the user by email
            const user = await User.findOne({ where: { email } });

            // Check if the user exists
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Check if the password is correct
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            // Dynamically generate a unique secret key for each user
            const secretKey = user.email + 'yourSecretKey';

            // Create a JWT token
            const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
                expiresIn: '1h', // Adjust the expiration time as needed
            });

            // Update the user's token in the database
            await user.update({ token });

            // Send the token and updated user data in the response
            res.cookie('token', token, { httpOnly: true }); // Set the token in an HTTP-only cookie
            res.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const {
                username,
                password,
                email,
                token,
                role,
                budget_proposal_amount,
                budget_proposal_description,
                budget_proposal_name,
                budget_proposal_status
            } = req.body;

            // Basic validation (you should implement more robust validation)
            if (!username || !password || !email) {
                return res.status(400).json({ error: 'Invalid input. All fields are required.' });
            }

            // Check if the user exists
            const existingUser = await User.findByPk(userId);
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Hash the new password before updating it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the user with the hashed password and new attributes
            const updateFields = {
                username,
                password: hashedPassword,
                email,
                token,
                role,
                budget_proposal_amount,
                budget_proposal_description,
                budget_proposal_name,
                budget_proposal_status
            };

            const updatedUser = await existingUser.update(updateFields);

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
    //Budget Proposal
    createBudget: async (req, res) => {
        try {
            const userId = req.params.userId; // Assuming the user ID is in the request parameters
            const {
                budget_proposal_amount,
                budget_proposal_description,
                budget_proposal_name,
            } = req.body;

            // Basic validation
            if (!budget_proposal_amount || !budget_proposal_description || !budget_proposal_name) {
                return res.status(400).json({ error: 'Invalid input. All required fields must be provided from.' });
            }

            // Check if the user exists
            const existingUser = await User.findByPk(userId);

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update the user's budget fields
            const updateFields = {
                budget_proposal_amount,
                budget_proposal_description,
                budget_proposal_name,
                budget_proposal_status: false, // default to false
            };

            await existingUser.update(updateFields);

            res.status(201).json(existingUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateBudget: async (req, res) => {
        try {
            const userId = req.params.userId; // Corrected to use 'userId'
            const {
                budget_proposal_amount,
                budget_proposal_description,
                budget_proposal_name,
                budget_proposal_status,
            } = req.body;

            // Basic validation
            if (!budget_proposal_amount || !budget_proposal_description || !budget_proposal_name) {
                return res.status(400).json({ error: 'Invalid input. All required fields must be provided.' });
            }

            // Check if the user exists
            const existingUser = await User.findByPk(userId);
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update the budget
            const updateFields = {
                budget_proposal_amount,
                budget_proposal_description,
                budget_proposal_name,
                budget_proposal_status,
            };

            const updatedUser = await existingUser.update(updateFields);

            res.json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    deleteBudget: async (req, res) => {
        try {
            const budgetId = req.params.id;

            // Check if the budget exists
            const existingBudget = await User.findByPk(budgetId);
            if (!existingBudget) {
                return res.status(404).json({ error: 'Budget not found' });
            }

            // Delete the budget
            await existingBudget.destroy();

            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    approveBudget: async (req, res) => {
        try {
            const budgetId = req.params.budgetId;

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

    notApproveBudget: async (req, res) => {
        try {
            const budgetId = req.params.budgetId;

            // Check if the budget exists
            const existingBudget = await User.findByPk(budgetId);
            if (!existingBudget) {
                return res.status(404).json({ error: 'Budget not found' });
            }

            // Update the budget status to true (approved)
            const updateFields = {
                budget_proposal_status: false,
            };

            const updatedBudget = await existingBudget.update(updateFields);

            res.json(updatedBudget);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { email, newPassword, confirmPassword } = req.body;

            // Validate input
            if (!email || !newPassword || !confirmPassword) {
                return res.status(400).json({ error: 'Invalid input. Email, newPassword, and confirmPassword are required.' });
            }

            // Check if newPassword and confirmPassword match
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: 'New password and confirm password do not match.' });
            }

            // Find the user by email
            const user = await User.findOne({ where: { email } });

            // Check if the user exists
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password in the database
            await user.update({ password: hashedPassword });

            res.status(200).json({ success: true, message: 'Password reset successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },




};

module.exports = UserController;
