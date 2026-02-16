const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, adminSecret } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Verify Admin Secret if role is admin
        if (role === 'admin') {
            const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'admin_secret_key_123';
            if (adminSecret !== ADMIN_SETUP_KEY) {
                return res.status(403).json({ message: 'Invalid Admin Setup Key' });
            }
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user (password will be hashed automatically by pre-save hook)
        const newUser = new User({
            name,
            email,
            password,
            role
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Notify Admin of new vendor
        if (newUser.role === 'vendor') {
            const notif = new Notification({
                recipient: 'admin',
                type: 'new_vendor',
                message: `New vendor registered: ${newUser.name}`,
                data: { vendorId: newUser._id }
            });
            await notif.save();

            req.io.to('admin').emit('notification', {
                ...notif.toObject(),
                data: newUser
            });
        }

        res.status(201).json({
            token,
            user: {
                _id: newUser._id,
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password using the model method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id, updatedUser.role)
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user && (await user.comparePassword(oldPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid old password' });
        }
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: '1d',
    });
};
