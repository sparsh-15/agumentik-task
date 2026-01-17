require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const admin = new User({
            name: 'Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
