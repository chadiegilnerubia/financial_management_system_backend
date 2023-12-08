const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const User = require('../models/User');

const signToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const generateToken = (userId, userEmail) => {
    return jwt.sign({ id: userId, email: userEmail }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};


const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    // Remove sensitive data from the user object before sending the response
    const { password, ...userWithoutPassword } = user.toJSON();

    res.status(statusCode).json({
        status: 'success',
        token,
        user: userWithoutPassword,
    });
};

exports.signup = async (req, res, next) => {
    try {
        const { username, password, email, user_type } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            user_type,
        });

        createSendToken(newUser, 201, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        createSendToken(user, 200, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'You are not logged in' });
    }

    try {
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'The user belonging to this token no longer exists' });
        }

        // Attach the user to the request object for further middleware to use
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

exports.restrictTo = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission to perform this action' });
        }
        next();
    };
};
