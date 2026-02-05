const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }

    // Connection event listeners
    mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB Disconnected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB Error:', err);
    });
};

module.exports = connectDB;
