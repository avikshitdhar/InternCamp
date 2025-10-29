const Student = require("../models/student");
const Company = require("../models/company");
const Admin = require("../models/admin");

const authenticateUser = async function (req, res, next) {
  try {
    const { type: enteredType, email: enteredEmail, password: enteredPassword } = req.body;
    let user;

    // Determine model based on user type
    switch (enteredType) {
      case 'student':
        user = await Student.findOne({ email: enteredEmail });
        break;
      case 'company':
        user = await Company.findOne({ email: enteredEmail });
        break;
      case 'admin':
        user = await Admin.findOne({ email: enteredEmail });
        break;
      default:
        return res.render('login', { error: "Invalid user type selected." });
    }

    // Check if user exists
    if (!user) {
      return res.render('login', { error: "No account found with that email." });
    }

    // Validate password (plain-text version for now)
    if (user.password !== enteredPassword) {
      return res.render('login', { error: "Incorrect password." });
    }

    // Auth successful → attach user info to request
    req.user = user;
    req.userType = enteredType;
    next();

  } catch (err) {
    console.error("Authentication error:", err);
    res.render('login', { error: "An unexpected error occurred. Please try again." });
  }
};

module.exports = authenticateUser;
