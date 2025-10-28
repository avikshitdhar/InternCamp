const Interview = require('../models/interview');
const Student = require('../models/student');

// middleware/placementTicker.js
module.exports = async function placementTicker(req, res, next) {
  try {
    const studentId = req.params.id || (req.user && req.user._id);
    if (!studentId) return next();

    const interviews = await Interview.find()
      .populate({
        path: 'applicationId',
        match: { studentId },
        populate: [
          { path: 'studentId', model: 'Student' },
          { path: 'postingId', model: 'Posting', populate: { path: 'userId', model: 'Company' } }
        ]
      });

    const validInterviews = interviews.filter(
      i => i && i.applicationId && i.applicationId.postingId && i.applicationId.postingId.userId
    );

    // Make both globally available
    res.locals.interviews = validInterviews;
    res.locals.hasAcceptedInterview = validInterviews.some(i => i.result === 'Accepted');

    next();
  } catch (err) {
    console.error('placementTicker error:', err);
    next(err);
  }
};
