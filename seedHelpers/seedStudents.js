const mongoose = require('mongoose');
// require('dotenv').config();
const Student = require('../models/student.js');
mongoose.connect('mongodb://localhost:27017/intern-web')
    .then(()=>{
        console.log("MONGOOSE ON");
    })
    .catch((err)=>{
        console.log(err);
    });

const sampleStudents = [
  {
    userId: 'u101',
    collegeId: 'C123',
    name: 'Alice Sharma',
    email: 'alice.sharma@example.com',
    program: 'B.Tech',
    department: 'Computer Science',
    graduation_year: 2026,
    cgpa: 8.5,
    resume_url: 'https://example.com/resumes/alice_sharma.pdf'
  },
  {
    userId: 'u102',
    collegeId: 'C124',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    program: 'B.Sc',
    department: 'Information Technology',
    graduation_year: 2025,
    cgpa: 7.8,
    resume_url: 'https://example.com/resumes/rahul_verma.pdf'
  }
];

const seed = async function () {
    for (let student of sampleStudents) {
      const newStudent = new Student({
        userId: student.userId,
        collegeId: student.collegeId,
        name: student.name,
        email: student.email,
        program: student.program,
        department: student.department,
        graduation_year: student.graduation_year,
        cgpa: student.cgpa,
        resume_url: student.resume_url
      });

      await newStudent.save();
    }
};

seed().then(()=>{
    mongoose.connection.close();
});
