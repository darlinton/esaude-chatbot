// Load environment variables
require('dotenv').config({ path: '../.env' });

// Import necessary modules
const mongoose = require('mongoose');
const User = require('../src/models/User'); // Adjust path as necessary based on project structure
const logger = require('../src/config/logger'); // Assuming a logger is available

async function listUsers() {
  try {
    // Connect to MongoDB
    logger.info(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected for listUsers script.');

    logger.info('Fetching all users from the database...');
    const users = await User.find();

    if (!users || users.length === 0) {
      logger.info('No users found in the database.');
      console.log('No users found in the database.');
    } else {
      console.log('--- User List ---');
      users.forEach(user => {
        // Adjust properties based on the actual User model structure.
        // Common properties might include id, username, email, role, createdAt, updatedAt.
        // We'll display a few common ones.
        console.log(`ID: ${user.id}, Username: ${user.username || 'N/A'}, Email: ${user.email || 'N/A'}, Role: ${user.role || 'N/A'}`);
      });
      console.log('-----------------');
      logger.info(`Successfully listed ${users.length} users.`);
    }

  } catch (error) {
    logger.error('Error listing users:', error);
    console.error('Failed to list users. Please check the logs for more details.');
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info('MongoDB disconnected.');
  }
}

// Execute the function
listUsers();
