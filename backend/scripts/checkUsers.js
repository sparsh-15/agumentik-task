require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');

        // Get all users
        const users = await User.find();
        console.log('\n=== ALL USERS ===');
        
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. User: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   isActive: ${user.isActive} (${typeof user.isActive})`);
            console.log(`   Created: ${user.createdAt}`);
            console.log(`   ID: ${user._id}`);
        });

        console.log(`\nTotal users: ${users.length}`);
        console.log(`Active users: ${users.filter(u => u.isActive !== false).length}`);
        console.log(`Inactive users: ${users.filter(u => u.isActive === false).length}`);
        console.log(`Users without isActive field: ${users.filter(u => u.isActive === undefined).length}`);

        // Update users without isActive field
        const usersWithoutIsActive = users.filter(u => u.isActive === undefined);
        if (usersWithoutIsActive.length > 0) {
            console.log('\n=== UPDATING USERS WITHOUT isActive FIELD ===');
            for (const user of usersWithoutIsActive) {
                user.isActive = true;
                await user.save();
                console.log(`Updated ${user.name} - set isActive to true`);
            }
        }

        console.log('\n=== DATABASE CHECK COMPLETE ===');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

checkUsers();