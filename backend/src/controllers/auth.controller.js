import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/user.model.js';

const generateToken = (userId) => {
    if (!config.JWT_SECRET) {
        throw new Error('JWT secret is not configured');
    }

    return jwt.sign({ id: userId }, config.JWT_SECRET, {
        expiresIn: '7d',
    });
};

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({
            $or: [ { email }, { username } ],
        });

        if (userExists) {
            return res.status(409).json({
                message: 'User already exists',
            });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        res.cookie('token', generateToken(user._id))

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        if (error?.code === 11000) {
            const duplicateField = Object.keys(error.keyValue || {})[ 0 ] || 'field';

            return res.status(409).json({
                message: `${duplicateField} already exists`,
            });
        }

        return res.status(500).json({
            message: error.message || 'Failed to register user',
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({
            $or: [ { email: identifier }, { username: identifier } ],
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const isPasswordValid = await user.matchPassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        res.cookie('token', generateToken(user._id))

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to login user',
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        return res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to get current user',
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            message: 'Logout successful',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to logout user',
        });
    }
};