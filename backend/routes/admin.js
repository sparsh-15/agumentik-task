const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

// Admin create user
router.post('/create-user', adminAuth, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = new User({
            name,
            email,
            password,
            role: role || 'user'
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Toggle user active status (admin only)
router.patch('/users/:id/toggle-status', adminAuth, async (req, res) => {
    try {
        console.log('Toggle status request for user ID:', req.params.id);
        console.log('Admin user:', req.user.name, req.user.email);
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            console.log('User not found:', req.params.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Found user:', user.name, 'Current status:', user.isActive);

        // Prevent deactivating admin users
        if (user.role === 'admin') {
            console.log('Attempted to deactivate admin user');
            return res.status(403).json({ message: 'Cannot deactivate admin users' });
        }

        const previousStatus = user.isActive;
        user.isActive = !user.isActive;
        await user.save();

        console.log('User status changed from', previousStatus, 'to', user.isActive);

        res.json({ 
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Toggle status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete user route (kept for backward compatibility but deprecated)
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Instead of deleting, deactivate the user
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        user.isActive = false;
        await user.save();

        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
