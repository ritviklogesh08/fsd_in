const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/document_access';

const seedAdmin = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminName = process.env.ADMIN_NAME || 'Admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log(`Admin already exists: ${adminEmail}`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({ name: adminName, email: adminEmail, password: hashed, role: 'ADMIN' });
    console.log(`Admin account created: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
