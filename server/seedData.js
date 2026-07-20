require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Skill = require('./models/Skill');
const Tool = require('./models/Tool');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@skills.com' });
    if (!admin) {
      console.log('Admin user not found. Please register admin@skills.com first.');
      process.exit(1);
    }

    // Create or find some categories
    const categoryNames = ['Technology', 'Home Repair', 'Gardening', 'Automotive', 'Tutoring'];
    const categories = [];
    for (const name of categoryNames) {
      let cat = await Category.findOne({ name });
      if (!cat) {
        cat = await Category.create({ name, description: `${name} category` });
      }
      categories.push(cat);
    }

    const techCat = categories.find(c => c.name === 'Technology')._id;
    const homeCat = categories.find(c => c.name === 'Home Repair')._id;
    const gardenCat = categories.find(c => c.name === 'Gardening')._id;
    const autoCat = categories.find(c => c.name === 'Automotive')._id;
    const tutorCat = categories.find(c => c.name === 'Tutoring')._id;

    // Skills
    const skills = [
      {
        provider: admin._id,
        title: 'Full Stack Web Development',
        description: 'I can build full-stack web applications using MERN stack.',
        category: techCat,
        images: ['https://picsum.photos/seed/skill1/400/300'],
        hourlyRate: 50,
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        provider: admin._id,
        title: 'Plumbing Repair Services',
        description: 'Experienced with fixing leaks, installing new fixtures, and unclogging drains.',
        category: homeCat,
        images: ['https://picsum.photos/seed/skill2/400/300'],
        hourlyRate: 40,
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        provider: admin._id,
        title: 'Landscape Design and Gardening',
        description: 'Complete landscaping and gardening services, including planting and maintenance.',
        category: gardenCat,
        images: ['https://picsum.photos/seed/skill3/400/300'],
        hourlyRate: 35,
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        provider: admin._id,
        title: 'Car Detailing and Basic Maintenance',
        description: 'I can wash, wax, and perform basic oil changes for your vehicles.',
        category: autoCat,
        images: ['https://picsum.photos/seed/skill4/400/300'],
        hourlyRate: 25,
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        provider: admin._id,
        title: 'Math and Science Tutoring',
        description: 'High school and college level tutoring for Math, Physics, and Chemistry.',
        category: tutorCat,
        images: ['https://picsum.photos/seed/skill5/400/300'],
        hourlyRate: 30,
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        provider: admin._id,
        title: 'Electrical Wiring and Installation',
        description: 'Certified electrician for home wiring and fixture installation.',
        category: homeCat,
        images: ['https://picsum.photos/seed/skill6/400/300'],
        hourlyRate: 60,
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        provider: admin._id,
        title: 'Mobile App Development (React Native)',
        description: 'I can build cross-platform mobile apps for iOS and Android.',
        category: techCat,
        images: ['https://picsum.photos/seed/skill7/400/300'],
        hourlyRate: 55,
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        provider: admin._id,
        title: 'English Literature Tutoring',
        description: 'Help with essay writing, reading comprehension, and literature analysis.',
        category: tutorCat,
        images: ['https://picsum.photos/seed/skill8/400/300'],
        hourlyRate: 25,
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
    ];

    // Tools
    const tools = [
      {
        owner: admin._id,
        name: 'Heavy Duty Power Drill',
        description: 'Cordless power drill with multiple bits. Great for home improvement projects.',
        category: homeCat,
        images: ['https://picsum.photos/seed/tool1/400/300'],
        pricePerDay: 15,
        depositAmount: 50,
        condition: 'Good',
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        owner: admin._id,
        name: 'Lawn Mower (Gas Powered)',
        description: 'Reliable lawn mower for medium to large yards.',
        category: gardenCat,
        images: ['https://picsum.photos/seed/tool2/400/300'],
        pricePerDay: 25,
        depositAmount: 100,
        condition: 'Good',
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        owner: admin._id,
        name: 'OBD2 Car Scanner',
        description: 'Diagnostic tool for reading engine codes on most vehicles.',
        category: autoCat,
        images: ['https://picsum.photos/seed/tool3/400/300'],
        pricePerDay: 10,
        depositAmount: 40,
        condition: 'Excellent',
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        owner: admin._id,
        name: 'Circular Saw',
        description: 'Electric circular saw for woodworking and carpentry.',
        category: homeCat,
        images: ['https://picsum.photos/seed/tool4/400/300'],
        pricePerDay: 20,
        depositAmount: 60,
        condition: 'Fair',
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        owner: admin._id,
        name: 'Professional DSLR Camera',
        description: 'High-quality camera for photography projects. Lens included.',
        category: techCat,
        images: ['https://picsum.photos/seed/tool5/400/300'],
        pricePerDay: 40,
        depositAmount: 200,
        condition: 'Excellent',
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        owner: admin._id,
        name: 'Wheelbarrow',
        description: 'Sturdy wheelbarrow for moving soil, gravel, and plants.',
        category: gardenCat,
        images: ['https://picsum.photos/seed/tool6/400/300'],
        pricePerDay: 10,
        depositAmount: 30,
        condition: 'Good',
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        owner: admin._id,
        name: 'Car Jack and Stands',
        description: 'Hydraulic floor jack and two heavy-duty jack stands.',
        category: autoCat,
        images: ['https://picsum.photos/seed/tool7/400/300'],
        pricePerDay: 15,
        depositAmount: 50,
        condition: 'Good',
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      },
      {
        owner: admin._id,
        name: 'Projector and Screen',
        description: 'HD projector with a 100-inch portable screen for events or movie nights.',
        category: techCat,
        images: ['https://picsum.photos/seed/tool8/400/300'],
        pricePerDay: 35,
        depositAmount: 150,
        condition: 'Excellent',
        isAvailable: true,
        location: { type: 'Point', coordinates: [-122.4194, 37.7749], address: 'San Francisco, CA' }
      }
    ];

    await Skill.insertMany(skills);
    console.log(`Inserted ${skills.length} skills`);

    await Tool.insertMany(tools);
    console.log(`Inserted ${tools.length} tools`);

    console.log('Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
