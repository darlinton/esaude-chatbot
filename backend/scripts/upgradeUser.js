require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../src/models/User'); // Adjust path as necessary

const upgradeUser = async (email) => {
    if (!email) {
        console.error('Please provide an email address to upgrade.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for script.');

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            mongoose.connection.close();
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`User ${email} successfully upgraded to admin.`);
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error upgrading user:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

// Get email from command line arguments
const userEmail = process.argv[2];
upgradeUser(userEmail);
