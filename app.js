// app.js
const express = require('express');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const authenticateUser = require('./middleware/authenticate.js');
require("dotenv").config();


(async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // Forces IPv4, helps on Windows networks
    });

    console.log('✅ MongoDB connected to host:', mongoose.connection.host);
    console.log('📦 Using database:', mongoose.connection.name);

    // app.listen(PORT, () => console.log(🚀 Server running on port ${PORT}));
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();

// Import Models
const Admin = require('./models/admin.js');
const Application = require('./models/application.js');
const Company = require('./models/company.js');
const Interview = require('./models/interview.js');
const Posting = require('./models/posting.js');
const Statistic = require('./models/statistic.js');
const Student = require('./models/student.js');
const User = require('./models/user.js');

// Setup Express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout','layouts/boilerplate');

// Routes
app.get('/', (req, res) => {
  res.render('load.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', authenticateUser, (req, res) => {
  res.redirect(`/api/${req.userType}/${req.user._id}`);
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', studentRoutes);
app.use('/', companyRoutes);
app.use('/', adminRoutes);

// Export app to be used in server.js
module.exports = app;
