const express=require('express');
const router=express.Router();

const Student = require('../models/student');
const Application = require('../models/application');
const Posting = require('../models/posting');
const Interview = require('../models/interview');
const Company=require('../models/company');


router.get('/api/company/:companyId',async(req,res)=>{
    const {companyId}=req.params;
    const company=await Company.findById(companyId).lean();
    const postings=await Posting.find({userId:companyId}).lean();
    const applications = await Application.find({ postingId: { $in: postings.map(p => p._id) } }).lean();

    res.render('companyViews/index',{company,postings,applications, layout:'layouts/companyplate'});
})

//all postings of a company
router.get('/api/company/:companyId/postings', async (req, res) => {
    const { companyId } = req.params;

    const company = await Company.findById(companyId).lean();

    const postings = await Posting.find({ userId: companyId })
        .populate({
            path: 'userId',
            model: 'Company',
            select: 'name logo email' // pick only the fields you need
        })
        .lean();

    const applications = await Application.find({ postingId: { $in: postings.map(p => p._id) } }).lean();

    res.render('companyViews/postings', {
        company,
        postings,
        applications,
        layout: 'layouts/companyplate'
    });
});

router.get('/api/company/:companyId/postings/new',async(req,res)=>{
    const {companyId}=req.params;
    const company=await Company.findById(companyId);
    res.render('companyViews/newPosting',{company,layout:'layouts/companyplate'});
});

router.post('/api/company/:companyId/postings', async (req, res) => {
  try {
    const { companyId } = req.params;
    const postingData = req.body.posting;

    if (postingData.eligibility) {
      // ✅ Handle eligibleDepartments
      if (postingData.eligibility.eligibleDepartments) {
        // Make sure it’s always an array
        if (!Array.isArray(postingData.eligibility.eligibleDepartments)) {
          postingData.eligibility.eligibleDepartments = [postingData.eligibility.eligibleDepartments];
        }
      } else {
        postingData.eligibility.eligibleDepartments = [];
      }

      // Eligible years (string input, split into array of numbers)
      if (postingData.eligibility.eligibleYears) {
        postingData.eligibility.eligibleYears = postingData.eligibility.eligibleYears
          .split(',')
          .map(y => parseInt(y.trim()));
      }
    }

    const posting = new Posting(postingData);
    posting.userId = companyId;

    await posting.save();
    res.redirect(`/api/company/${companyId}/postings/${posting._id}`);
  } catch (err) {
    console.error("Error creating posting:", err);
    res.status(400).send("Failed to create posting");
  }
});


router.patch('/api/company/:companyId/postings/:postingId', async (req, res) => {
  try {
    const { companyId, postingId } = req.params;
    const updatedData = req.body.posting;

    // Ensure eligibility object exists
    updatedData.eligibility = updatedData.eligibility || {};

    // Handle departments (array from checkboxes)
    if (updatedData.eligibility.eligibleDepartments) {
      if (!Array.isArray(updatedData.eligibility.eligibleDepartments)) {
        // fallback for old string input
        updatedData.eligibility.eligibleDepartments = updatedData.eligibility.eligibleDepartments
          .split(',')
          .map(dep => dep.trim());
      }
    } else {
      updatedData.eligibility.eligibleDepartments = [];
    }

    // Handle eligible years (always array of integers)
    if (updatedData.eligibility.eligibleYears) {
      if (typeof updatedData.eligibility.eligibleYears === 'string') {
        updatedData.eligibility.eligibleYears = updatedData.eligibility.eligibleYears
          .split(',')
          .map(y => parseInt(y.trim()));
      } else if (!Array.isArray(updatedData.eligibility.eligibleYears)) {
        updatedData.eligibility.eligibleYears = [];
      }
    } else {
      updatedData.eligibility.eligibleYears = [];
    }

    // Update the posting
    await Posting.findByIdAndUpdate(postingId, updatedData, { new: true });

    res.redirect(`/api/company/${companyId}/postings/${postingId}`);
  } catch (err) {
    console.error("Error updating posting:", err);
    res.status(400).send("Failed to update posting");
  }
});



router.get('/api/company/:companyId/postings/:postingId',async(req,res)=>{
    const {companyId,postingId}=req.params;
    const company=await Company.findById(companyId);
    const posting=await Posting.findById(postingId);
    const applications=await Application.find({postingId:posting._id});
    res.render('companyViews/showPosting',{company,posting,applications,layout:'layouts/companyplate'});
});


router.get('/api/company/:companyId/postings/:postingId/applications', async (req, res) => {
  try {
    const { companyId, postingId } = req.params;

    const company = await Company.findById(companyId);
    const posting = await Posting.findById(postingId);

    // Get all applications for this posting
    const applications = await Application.find({ postingId })
      .populate('studentId')
      .lean();

    // Get all interviews for these applications only
    const interviews = await Interview.find({
      applicationId: { $in: applications.map(a => a._id) }
    })
      .populate({
        path: 'applicationId',
        populate: { path: 'studentId', select: '_id' }
      })
      .lean();

    // Map: applicationId -> interview
    const interviewMap = {};
    for (const iv of interviews) {
      interviewMap[iv.applicationId._id.toString()] = iv;
    }

    // Mark placed & selected students
    const placedStudents = new Set();
    const selectedStudents = new Set();

    for (const iv of interviews) {
      if (iv.result === 'Accepted' && iv.applicationId?.studentId?._id) {
        placedStudents.add(iv.applicationId.studentId._id.toString());
      }

      if (
        iv.result === 'Accepted' &&
        iv.applicationId?.postingId?.toString() === postingId
      ) {
        selectedStudents.add(iv.applicationId.studentId._id.toString());
      }
    }

    // Attach interview to each application
    const appsWithInterviews = applications.map(a => ({
      ...a,
      interview: interviewMap[a._id.toString()] || null
    }));

    res.render('companyViews/applications', {
      company,
      posting,
      applications: appsWithInterviews,
      placedStudents,
      selectedStudents,
      layout: 'layouts/companyplate'
    });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).send('Internal Server Error');
  }
});



//showing a particular application

router.get('/api/company/:companyId/postings/:postingId/applications/:applicationId', async (req, res) => {
    try {
        const { companyId, postingId, applicationId } = req.params;

        const company = await Company.findById(companyId);
        const posting = await Posting.findById(postingId);

        const application = await Application.findById(applicationId)
            .populate('studentId')   
            .populate('postingId');  

        if (!application) {
            return res.status(404).send('Application not found');
        }

        const interview=await Interview.findOne({applicationId:application._id});

        res.render('companyViews/showApplication', {
            company,
            posting,
            interview,
            application,
            layout: 'layouts/companyplate'
        });

    } catch (err) {
        console.error('Error fetching application:', err);
        res.status(500).send('Internal Server Error');
    }
});


//deleting an opportunity

router.delete('/api/company/:companyId/postings/:postingId',async(req,res)=>{
    const {companyId,postingId}=req.params;
    const company=await Company.findById(companyId);
    const posting=await Posting.findById(postingId);

    if (!posting) {
            return res.status(404).send('Posting not found');
    }


    const applications=await Application.find({postingId:postingId});
    for(let appl of applications){
        await Interview.deleteMany({applicationId:appl._id});
    }
    await Application.deleteMany({postingId:postingId});
    await Posting.findByIdAndDelete(postingId);
    res.redirect(`/api/company/${company._id}/postings`);
});

router.get('/api/company/:companyId/postings/:postingId/edit',async(req,res)=>{
    const {companyId,postingId}=req.params;
    const company=await Company.findById(companyId);
    const posting=await Posting.findById(postingId);
    res.render('companyViews/editPosting',{company, posting, layout:'layouts/companyplate'});
})

//rejecting a student

router.patch('/api/company/:companyId/postings/:postingId/applications/:applicationId/reject', async (req, res) => {
  try {
    const { companyId, postingId, applicationId } = req.params;
    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      { status: 'Rejected' },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).send('Application not found');
    }

    res.redirect(`/api/company/${companyId}/postings/${postingId}/applications`); // or back to posting
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//uploading test link

router.patch('/api/company/:companyId/postings/:postingId/uploadTestLink',async(req,res)=>{
    const {companyId,postingId}=req.params;
    const applications=await Application.find({postingId:postingId});
    const {testLink}=req.body;
    let score;

    for(let appl of applications){
        // score=Math.floor(Math.random()*101);
        appl.testLink=testLink;
        // appl.testScore=score;
        // appl.status='TestCompleted';
        await appl.save();
    }


    res.redirect(`/api/company/${companyId}/postings/${postingId}`);

});

//shortlisting a candidate

router.patch('/api/company/:companyId/postings/:postingId/applications/:applicationId/shortlist', async (req, res) => {
  try {
    const { companyId, postingId, applicationId } = req.params;
    const { interviewDate, interviewTime } = req.body;

    const interviewDateTime = new Date(`${interviewDate}T${interviewTime}:00Z`);

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).send('Application not found');

    const interview = new Interview({
      applicationId: application._id,
      result:'Pending',
      interviewDate: interviewDateTime
    });

    await interview.save();

    application.status = 'Shortlisted';
    await application.save();

    res.redirect(`/api/company/${companyId}/postings/${postingId}/applications`);
  } catch (err) {
    console.error('Error shortlisting application:', err);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/api/company/:companyId/interviews', async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId).lean();
    if (!company) return res.status(404).send('Company not found');

    const postings = await Posting.find({ userId: companyId }).lean();

    const postingIds = postings.map(p => p._id);
    const applications = await Application.find({ postingId: { $in: postingIds } })
      .populate('studentId', 'name email department')
      .populate({
        path: 'postingId',
        populate: { path: 'userId', select: 'name' }
      })
      .lean();

    const applicationIds = applications.map(a => a._id);
    const interviews = await Interview.find({ applicationId: { $in: applicationIds } })
      .populate({
        path: 'applicationId',
        populate: [
          { path: 'studentId', select: 'name email department' },
          { path: 'postingId', populate: { path: 'userId', select: 'name' } }
        ]
      })
      .lean();

    // Pass company to the layout
    res.render('companyViews/interviews', { company, interviews, layout: 'layouts/companyplate' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/api/company/:companyId/interviews/:interviewId', async (req, res) => {
    const { companyId,interviewId } = req.params;
    const company=await Company.findById(companyId);

    try {
        // Find the interview and populate necessary fields
        const interview = await Interview.findById(interviewId)
            .populate({
                path: 'applicationId',
                populate: [
                    {
                        path: 'postingId',
                        select: 'title', // posting info
                    },
                    {
                        path: 'studentId',
                        select: 'name', // student info
                    }
                ]
            })
            .lean();

        if (!interview || !interview.applicationId) {
            return res.status(404).send('Interview not found');
        }

        res.render('companyViews/showInterview', {
            company,
            interview,
            application: interview.applicationId, // easier access in EJS
            layout: 'layouts/companyplate'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.patch('/api/company/:companyId/interviews/:interviewId/accept',async(req,res)=>{
  const {companyId,interviewId}=req.params;
  const interview=await Interview.findById(interviewId);
  interview.result='Accepted';
  await interview.save();
  res.redirect(`/api/company/${companyId}/interviews`);
})

router.patch('/api/company/:companyId/interviews/:interviewId/reject',async(req,res)=>{
  const {companyId,interviewId}=req.params;
  const interview=await Interview.findById(interviewId);
  interview.result='Rejected';
  await interview.save();
  res.redirect(`/api/company/${companyId}/interviews`);

})

module.exports=router;