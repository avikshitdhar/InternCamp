const express = require('express');
const router = express.Router();
const authenticateUser=require('../middleware/authenticate');

const placementTicker = require('../middleware/placementTicker');

// Middlewar
router.use('/api/student/:id', placementTicker);

const Student = require('../models/student');
const Application = require('../models/application');
const Posting = require('../models/posting');
const Interview = require('../models/interview');

// ------------------------- Routes -------------------------

// Student profile
router.get('/api/student/:id', async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id).lean();
  if (!student) return res.status(404).send("Student not found");

  res.render('studentViews/index', { student, layout: 'layouts/studentplate' });
});

// Applications list
router.get('/api/student/:id/applications', async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id).lean();

  // Fetch applications only
  const applications = await Application.find({ studentId: id })
    .populate({
      path: 'postingId',
      populate: { path: 'userId', model: 'Company', select: 'name userId' }
    })
    .lean();

  // Pass **applications** only; leave interviews for middleware
  res.render('studentViews/applications', {
    student,
    applications,
    layout: 'layouts/studentplate'
  });
});


// Individual application
router.get('/api/student/:id/applications/:applicationId', async (req, res) => {
  const { id, applicationId } = req.params;
  const student = await Student.findById(id).lean();
  const application = await Application.findById(applicationId)
    .populate({
      path: 'postingId',
      populate: { path: 'userId', model: 'Company', select: 'name userId' }
    })
    .lean();

  if (!application) return res.status(404).send("Application not found");

  const interview = await Interview.findOne({ applicationId: application._id }).lean();

  res.render('studentViews/showApplication', { student, application, interview, layout: 'layouts/studentplate' });
});

//taking test
router.patch('/api/student/:id/applications/:applicationId/test', async (req, res) => {
  try {
    const { id, applicationId } = req.params;

    const student = await Student.findById(id);
    const application = await Application.findById(applicationId);

    if (!student || !application) {
      return res.status(404).send("Student or Application not found");
    }

    const score = Math.floor(Math.random() * 101);
    application.testScore = score;
    application.status = 'TestCompleted';
    await application.save();

    res.redirect(`/api/student/${id}/applications/${applicationId}`);
  } catch (err) {
    console.error("Error completing test:", err);
    res.status(500).send("Internal Server Error");
  }
});


// Interviews
router.get('/api/student/:id/interviews', async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id).lean();

  const interviews = await Interview.find()
    .populate({
      path: 'applicationId',
      match: { studentId: id },
      populate: { path: 'postingId', populate: { path: 'userId', model: 'Company', select: 'name userId' } }
    })
    .lean();

  const validInterviews = interviews.filter(i => i.applicationId && i.applicationId.postingId);
  res.render('studentViews/interviews', { student, interviews: validInterviews, layout: 'layouts/studentplate' });
});

router.get('/api/student/:id/applications/:applicationId/interview', async (req, res) => {
  const { id, applicationId } = req.params;

  const student = await Student.findById(id);
  const application = await Application.findById(applicationId)
    .populate({
      path: 'postingId',
      populate: { path: 'userId', model: 'Company' }
    });

  const interview = await Interview.findOne({ applicationId: applicationId });

  if (!interview) {
    return res.render('studentViews/interviewNotScheduled', {
      student,
      application,
      layout: 'layouts/studentplate'
    });
  }

  res.render('studentViews/showInterview', {
    student,
    application,
    interview,
    layout: 'layouts/studentplate'
  });
});



// Opportunities
router.get('/api/student/:id/opportunities', async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id).lean();
  if (!student) return res.status(404).send('Student not found');

  const opportunities = await Posting.find({ 'eligibility.eligibleDepartments': student.department })
    .populate({ path: 'userId', model: 'Company', select: 'name' })
    .lean();

  if (!opportunities.length) return res.render('studentViews/noOpportunity', { student, layout: 'layouts/studentplate' });

  res.render('studentViews/opportunities', { student, opportunities, layout: 'layouts/studentplate' });
});

// Individual opportunity
router.get('/api/student/:id/opportunities/:opportunityId', async (req, res) => {
  const { id, opportunityId } = req.params;
  const student = await Student.findById(id).lean();
  const opportunity = await Posting.findById(opportunityId)
    .populate('userId', 'name email')
    .lean();

  const application = await Application.findOne({ postingId: opportunity._id, studentId: student._id }).lean();

  res.render('studentViews/showOpportunity', { student, opportunity, application, layout: 'layouts/studentplate' });
});

// Apply to an opportunity
router.post('/api/student/:id/opportunities/:opportunityId', async (req, res) => {
  const { id, opportunityId } = req.params;
  const randNum = Math.floor(Math.random() * 1000);

  const student = await Student.findById(id).lean();
  const opportunity = await Posting.findById(opportunityId).lean();

  const application = new Application({
    postingId: opportunity._id,
    studentId: student._id,
  });

  await application.save();
  res.redirect(`/api/student/${student._id}/applications`);
});

module.exports = router;
