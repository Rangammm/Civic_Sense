import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Issue from '../models/Issue.js';

dotenv.config({ path: '../.env' });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civicsense');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Issue.deleteMany();
    console.log('Cleared existing data.');

    // Create a sample user
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Civic Admin',
      email: 'admin@civicsense.in',
      password,
      role: 'admin',
      civicPoints: 1000
    });
    console.log('Admin user created.');

    const user = await User.create({
      name: 'Rangam Trivedi',
      email: 'user@civicsense.in',
      password,
      role: 'citizen',
      civicPoints: 50
    });
    console.log('Sample user created.');

    // Vadodara coordinates (approx center: 22.3072, 73.1812)
    const vadodaraIssues = [
      {
        title: 'Deep Pothole on Vasna Road',
        description: 'Large and dangerous pothole near the main intersection. Causes traffic slowdowns and damage to vehicles.',
        category: 'Pothole',
        status: 'submitted',
        priority: 'high',
        location: {
          address: 'Vasna Road, Vadodara, Gujarat 390007',
          coordinates: { lat: 22.3015, lng: 73.1512 }
        },
        reportedBy: user._id
      },
      {
        title: 'Garbage Pileup near Sayaji Baug',
        description: 'Waste has been accumulating for over 3 days near the garden entrance. Needs urgent clearance.',
        category: 'Garbage',
        status: 'progress',
        priority: 'medium',
        location: {
          address: 'Sayaji Baug, Kala Ghoda, Vadodara, Gujarat 390001',
          coordinates: { lat: 22.3135, lng: 73.1912 }
        },
        reportedBy: user._id
      },
      {
        title: 'Clogged Drainage at Akota Bridge',
        description: 'Severe waterlogging under the bridge after 30 mins of rain. Drainage system seems completely blocked.',
        category: 'Water',
        status: 'submitted',
        priority: 'critical',
        location: {
          address: 'Akota Bridge, Akota, Vadodara, Gujarat 390020',
          coordinates: { lat: 22.2985, lng: 73.1752 }
        },
        reportedBy: user._id
      },
      {
        title: 'Streetlights Not Working in Alkapuri',
        description: 'Section of RC Dutt Road is completely dark. High risk of accidents at night.',
        category: 'Streetlight',
        status: 'resolved',
        priority: 'medium',
        location: {
          address: 'RC Dutt Road, Alkapuri, Vadodara, Gujarat 390007',
          coordinates: { lat: 22.3115, lng: 73.1712 }
        },
        reportedBy: user._id,
        resolvedAt: new Date()
      }
    ];

    await Issue.insertMany(vadodaraIssues);
    console.log('Sample issues created in Vadodara.');

    console.log('Database seeded successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
