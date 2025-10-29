const express = require('express');
const cors = require('cors');
const router=express.Router();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;


mongoose.connect(mongoUri)
// , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // exit to fail fast (optional)
});
const Admin=require('./models/admin.js');
const Application=require('./models/application.js');
const Company=require('./models/company.js');
const Interview=require('./models/interview.js');
const Posting=require('./models/posting.js');
const Statistic=require('./models/statistic.js');
const Student=require('./models/student.js');
const User=require('./models/user.js');


// const mongoose = require('mongoose'); // Removed for now
// const connectDB = require('./config/db'); // Removed for now

// const { requestLogger } = require('./middleware/logger.middleware');
// const { notFound } = require('./middleware/notFound.middleware');
// const { errorHandler } = require('./middleware/error.middleware');
const path = require('path');
const authenticateUser=require('./middleware/authenticate.js');





// const userRoutes = require('./routes/user.routes');
// const studentRoutes = require('./routes/user.students.routes');
// const companyRoutes = require('./routes/user.company.routes');
// const adminRoutes = require('./routes/user.admin.routes');
// const postingRoutes = require('./routes/postings.routes');
// const applicationRoutes = require('./routes/applications.routes');
// const interviewRoutes = require('./routes/interview.routes');
// const statisticsRoutes = require('./routes/statistics.routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const methodOverride=require('method-override');
app.use(methodOverride('_method'));


// Middleware setup
app.use(cors());
app.use(express.json());
// app.use(requestLogger);
// Tell Express where your views are
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout','layouts/boilerplate');

// Simple home route
app.get('/', (req, res) => {
    res.render('load.ejs');
});

//login
app.get('/login',(req,res)=>{
    res.render('login.ejs');
});

// LOGIN ROUTE
app.post('/login', authenticateUser, (req, res) => {
  res.redirect(`/api/${req.userType}/${req.user._id}`);
});



//signup
app.get('/signup',(req,res)=>{
    res.render('signup.ejs');
})

//////STUDENT ROUTES//////////
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes=require('./routes/companyRoutes');
const adminRoutes=require('./routes/adminRoutes.js');

app.use('/', studentRoutes);
app.use('/',companyRoutes);
app.use('/',adminRoutes);

module.exports = app;
























































// Routes
// app.use('/api/users', userRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/companies', companyRoutes);
// app.use('/api/admins', adminRoutes);
// app.use('/api/postings', postingRoutes);
// app.use('/api/applications', applicationRoutes);
// app.use('/api/interviews', interviewRoutes);
// app.use('/api/statistics', statisticsRoutes);

// 404 + error middleware
// app.use(notFound);
// app.use(errorHandler);

// Start server locally
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
