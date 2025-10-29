const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Company = require('../models/company');
const Posting = require('../models/posting');
const Application = require('../models/application');
const Admin = require('../models/admin');

router.get('/api/admin/:adminId',async(req,res)=>{
    const {adminId}=req.params;
    const admin=await Admin.findById(adminId).lean();
    res.render('adminViews/index',{admin,layout:'layouts/adminplate'});
})

router.get('/api/admin/:id/statistics', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).lean();

    const [totalStudents, totalCompanies, totalPostings, totalApplications, totalAcceptedData, avgStipendData] =
      await Promise.all([
        Student.countDocuments(),
        Company.countDocuments(),
        Posting.countDocuments(),
        Application.countDocuments(),
        Application.countDocuments({ status: 'Accepted' }),
        Posting.aggregate([{ $group: { _id: null, avg: { $avg: "$stipend" } } }])
      ]);

    const avgStipend = avgStipendData.length ? avgStipendData[0].avg : 0;

    res.render('adminViews/viewStats', {
      layout: 'layouts/adminplate',
      admin,
      totalStudents,
      totalCompanies,
      totalPostings,
      totalApplications,
      totalAccepted: totalAcceptedData,
      avgStipend
    });

  } catch (err) {
    console.error("Error loading admin dashboard:", err);
    res.status(500).send("Error loading dashboard");
  }
});

module.exports = router;
