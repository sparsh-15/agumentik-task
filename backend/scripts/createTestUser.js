require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createTestUser = async () => {
    try {
        await connectDB();

        const testEmail = 'user@example.com';
        const testPassword = 'user123';

        const existingUser = await User.findOne({ email: testEmail });
        
        if (existingUser) {
            console.log('Test user already exists');
            console.log(`Email: ${testEmail}`);
            console.log(`Password: ${testPassword}`);
            process.exit(0);
        }

        const user = new User({
            name: 'Test User',
            email: testEmail,
            password: testPassword,
            role: 'user'
        });

        await user.save();
        console.log('Test user created successfully');
        console.log(`Email: ${testEmail}`);
        console.log(`Password: ${testPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating test user:', error.message);
        process.exit(1);
    }
};

createTestUser();
