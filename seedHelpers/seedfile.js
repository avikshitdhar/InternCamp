// // // const mongoose = require('mongoose');
// // // const Admin = require('../models/admin');
// // // const Company = require('../models/company');
// // // const Student = require('../models/student');
// // // const Posting = require('../models/posting');
// // // const Application = require('../models/application');
// // // const Interview = require('../models/interview');
// // // const Statistics = require('../models/statistic');

// // // mongoose.connect('mongodb://localhost:27017/intern-web', {
// // //   useNewUrlParser: true,
// // //   useUnifiedTopology: true,
// // // })
// // // .then(() => console.log("MongoDB Connected"))
// // // .catch(err => console.error(err));

// // // async function seed() {
// // //   try {
// // //     // Clear collections
// // //     await Admin.deleteMany({});
// // //     await Company.deleteMany({});
// // //     await Student.deleteMany({});
// // //     await Posting.deleteMany({});
// // //     await Application.deleteMany({});
// // //     await Interview.deleteMany({});
// // //     await Statistics.deleteMany({});
// // //     console.log("Collections cleared");

// // //     // --- Admins ---
// // //     const admins = await Admin.insertMany([
// // //       { name: "Admin One", email: "admin1@example.com", password: "admin123" },
// // //       { name: "Admin Two", email: "admin2@example.com", password: "admin123" },
// // //     ]);

// // //     // --- Companies ---
// // //     const companies = await Company.insertMany([
// // //       { name: "Google", email: "google@example.com", password: "pass123" },
// // //       { name: "Microsoft", email: "microsoft@example.com", password: "pass123" },
// // //       { name: "Amazon", email: "amazon@example.com", password: "pass123" },
// // //       { name: "Facebook", email: "facebook@example.com", password: "pass123" },
// // //     ]);

// // //     // --- Students ---
// // //     const students = await Student.insertMany([
// // //       { name: "Alice Johnson", email: "alice@example.com", collegeId: "C101", program: "B.Tech", department: "Computer Science", graduation_year: 2025, cgpa: 9.1, resume_url: "" },
// // //       { name: "Bob Smith", email: "bob@example.com", collegeId: "C102", program: "B.Tech", department: "Electronics", graduation_year: 2024, cgpa: 8.5, resume_url: "" },
// // //       { name: "Charlie Lee", email: "charlie@example.com", collegeId: "C103", program: "B.Tech", department: "Mechanical", graduation_year: 2025, cgpa: 8.8, resume_url: "" },
// // //       { name: "Diana Prince", email: "diana@example.com", collegeId: "C104", program: "B.Tech", department: "Civil", graduation_year: 2024, cgpa: 9.0, resume_url: "" },
// // //     ]);

// // //     // --- Postings ---
// // //     const postings = await Posting.insertMany([
// // //       { 
// // //         userId: companies[0]._id,
// // //         title: "Software Engineer Intern",
// // //         description: "Work on real Google products and projects",
// // //         postingType: "Internship",
// // //         eligibility: { minCgpa: 8, eligibleDepartments: ["Computer Science", "Electronics"], eligibleYears: [2024, 2025] },
// // //         location: "Mountain View, CA",
// // //         deadline: new Date("2025-11-15"),
// // //         stipend: 1500
// // //       },
// // //       { 
// // //         userId: companies[1]._id,
// // //         title: "Cloud Solutions Intern",
// // //         description: "Assist Microsoft teams with cloud deployment projects",
// // //         postingType: "Internship",
// // //         eligibility: { minCgpa: 7.5, eligibleDepartments: ["Computer Science"], eligibleYears: [2024, 2025] },
// // //         location: "Redmond, WA",
// // //         deadline: new Date("2025-11-30"),
// // //         stipend: 1200
// // //       },
// // //       { 
// // //         userId: companies[2]._id,
// // //         title: "Data Engineer Intern",
// // //         description: "Work with Amazon data pipelines",
// // //         postingType: "Internship",
// // //         eligibility: { minCgpa: 8, eligibleDepartments: ["Computer Science", "Electronics"], eligibleYears: [2024, 2025] },
// // //         location: "Seattle, WA",
// // //         deadline: new Date("2025-12-05"),
// // //         stipend: 1400
// // //       },
// // //     ]);

// // //     // --- Applications ---
// // //     const applications = await Application.insertMany([
// // //       { postingId: postings[0]._id, studentId: students[0]._id, status: "Applied" },
// // //       { postingId: postings[0]._id, studentId: students[1]._id, status: "Applied" },
// // //       { postingId: postings[1]._id, studentId: students[2]._id, status: "Applied" },
// // //       { postingId: postings[2]._id, studentId: students[3]._id, status: "Applied" },
// // //       { postingId: postings[2]._id, studentId: students[0]._id, status: "Shortlisted" },
// // //     ]);

// // //     // --- Interviews ---
// // //     await Interview.insertMany([
// // //       { applicationId: applications[4]._id, testLink: "https://test.com/abcd", interviewDate: new Date("2025-11-20"), feedback: "Strong candidate", result: "Accepted" },
// // //       { applicationId: applications[1]._id, testLink: "https://test.com/efgh", interviewDate: new Date("2025-11-18"), feedback: "Average", result: "Pending" },
// // //     ]);

// // //     // --- Statistics ---
// // //     await Statistics.create({
// // //       totalStudents: students.length,
// // //       totalCompanies: companies.length,
// // //       totalPostings: postings.length,
// // //       totalApplications: applications.length,
// // //       shortlistedCount: applications.filter(a => a.status === "Shortlisted").length,
// // //       placedCount: 1, // just for example
// // //       topDepartments: ["Computer Science", "Electronics"]
// // //     });

// // //     console.log("Seed complete!");
// // //     mongoose.connection.close();
// // //   } catch (err) {
// // //     console.error(err);
// // //   }
// // // }

// // // seed();
// // const mongoose = require('mongoose');
// // const Student = require('../models/student'); // adjust path if needed

// // async function createLowCgpaStudent() {
// //   await mongoose.connect('mongodb://localhost:27017/intern-web');

// //   const student = new Student({
// //     collegeId: 'CSE2023009',
// //     name: 'Riya Sharma',
// //     email: 'riya.sharma@example.com',
// //     program: 'B.Tech',
// //     department: 'CSE',
// //     graduation_year: 2026,
// //     cgpa: 7.2, // <---- less than 7.5
// //     resume_url: 'https://drive.google.com/example_resume'
// //   });

// //   await student.save();
// //   console.log('✅ Student created:', student);

// //   mongoose.connection.close();
// // }

// // createLowCgpaStudent();

// const mongoose = require('mongoose');
// const Posting = require('../models/posting'); // adjust path if needed

// async function createLowCgpaPosting() {
//   await mongoose.connect('mongodb://localhost:27017/intern-web');

//   const posting = new Posting({
//     userId: new mongoose.Types.ObjectId('652c8b9f9e0e6b2c6f2f1234'), // replace with a valid Company _id
//     title: 'Web Development Intern',
//     description: 'Assist in building and maintaining responsive web applications using MERN stack.',
//     postingType: 'Internship',
//     eligibility: {
//       minCgpa: 6.0, // low CGPA requirement
//       eligibleDepartments: ['CSE', 'IT', 'ECE'],
//       eligibleYears: [2025, 2026],
//     },
//     location: 'Bangalore, India',
//     deadline: new Date('2025-11-15'),
//     stipend: 10000,
//   });

//   await posting.save();
//   console.log('✅ Low CGPA posting created:', posting);

//   mongoose.connection.close();
// }

// createLowCgpaPosting();

// const mongoose = require('mongoose');
// const Company = require('../models/company'); // adjust path
// const Posting = require('../models/posting'); // adjust path

// async function seedCompanyAndPosting() {
//   await mongoose.connect('mongodb://localhost:27017/intern-web');

//   // --- Create a company ---
//   const company = new Company({
//     name: 'TechCorp Solutions',
//     email: 'hr@techcorp.com',
//     password: 'securepassword123'
//   });

//   await company.save();
//   console.log('✅ Company created:', company);

//   // --- Create a posting for that company ---
//   const posting = new Posting({
//     userId: company._id,   // reference the company
//     title: 'Frontend Developer Intern',
//     description: 'Work on React-based web applications and improve UI/UX.',
//     postingType: 'Internship',
//     eligibility: {
//       minCgpa: 6.5,
//       eligibleDepartments: ['CSE', 'IT', 'ECE'],
//       eligibleYears: [2025, 2026]
//     },
//     location: 'Bangalore, India',
//     deadline: new Date('2025-11-30'),
//     stipend: 12000
//   });

//   await posting.save();
//   console.log('✅ Posting created:', posting);

//   mongoose.connection.close();
// }

// seedCompanyAndPosting();


// deleteBrokenApplications.js
// require('dotenv').config();
// const mongoose = require('mongoose');
// const Application = require('../models/Application');
// const Posting = require('../models/Posting');

// async function deleteBrokenApplications() {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/intern-web', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('✅ Connected to MongoDB');

//     // Find all application postingIds
//     const applications = await Application.find({}, 'postingId');

//     let deletedCount = 0;

//     for (const appl of applications) {
//       const postingExists = await Posting.exists({ _id: appl.postingId });
//       if (!postingExists) {
//         await Application.deleteOne({ _id: appl._id });
//         console.log(`🗑️ Deleted application ${appl._id} (broken postingId ${appl.postingId})`);
//         deletedCount++;
//       }
//     }

//     console.log(`\n✅ Done. Deleted ${deletedCount} invalid application(s).`);
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error:', err);
//     process.exit(1);
//   }
// }

// deleteBrokenApplications();

