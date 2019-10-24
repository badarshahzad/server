const express = require("express");
const router = express.Router();
const gravater = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const nodemailer = require("nodemailer");

// Load Input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateForgotPassword = require("../../validation/forgotPassword");

// Load User model
const User = require("../../models/Users");

const sendEmail = async receiverEmail => {
  let transporter = nodemailer.createTransport({
    host: "smtp3.5stardesigners.net",
    port: 2525,
    rejectUnauthorized: false,
    //useAuthentication: 'yes',
    secure: false,
    useAuthentication: false,
    tls: {
      rejectUnauthorized: false
    },
    // // true for 465, false for other ports
    auth: {
      user: "info@clients3.5stardesigners.net", // generated ethereal user
      pass: "rQMNcKnJg5" // generated ethereal password
    }
  });

  let info = await transporter.sendMail({
    from: "info@sudoz.com", // sender address
    to: receiverEmail, // list of receivers
    subject: "WELCOME TO COMMEX GLOBAL", // Subject line
    text: "", // plain text body
    html:
      "<html>" +
      "<h2>" +
      "Commex" +
      "</h2>" +
      "<br>" +
      "<body>" +
      '<p>Thank you for registering with Sudoz Global, please log into your account using the following link: <a href="https://commexminerals.com/#/login">Login</a></p>' +
      "</body>" +
      "</html>" // html body
  });

  console.log("The send email informtion is: " + JSON.stringify(info));
};

/**
 *  @route POST api/users/forgotpassword
 *  @desc Forgotpassword
 *  @access Public
 */
router.post("/forgot", (req, res) => {
  const { errors, isValid } = validateForgotPassword(req.body);

  // Check Validation
  // isValid: it will be true when the data is available
  if (!isValid) {
    res.status(400).json(errors);
  }

  // Send email to the user to reset password
});

/**
 *  @route  POST api/users/regiester
 *  @desc   Register
 *  @access Public
 */
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  // isValid: it will be true when the data is available
  if (!isValid) {
    res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exist";
      return res.status(400).json(errors);
    } else {
      const object = sendEmail(req.body.email);
      // Send Email to the user
      console.log(" The email send informtion : " + JSON.stringify(object));

      const avatar = gravater.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" // Default
      });

      const newUser = new User({
        firstName: req.body.firstName,
        email: req.body.email,
        lastName: req.body.lastName,
        titleRole: req.body.titleRole,
        other: req.body.other,
        institutionName: req.body.institutionName,
        username: req.body.username,
        password: req.body.password,
        password2: req.body.password2
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) res.json(err);
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              //created a profile
              const newProfile = new Profile({
                user: user._id
              });

              newProfile
                .save()
                .then(() => {
                  console.log("Profiel created");
                })
                .catch(err => res.json(404).json(err));

              res.json(user);
            })

            .catch(err => console.log(err));
        });
      });
    }
  });
});

/**
 *  @route  POST api/users/regiester
 *  @desc   Login User / Returning JWT token
 *  @access Public
 */
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  console.log("isValid response value is: " + isValid);
  // Check Validation
  // isValid: it will be true when the data is avilable
  if (!isValid) {
    console.log("This is not valid");
    res.status(400).json(errors);
  } else {
    console.log("this is valid response");
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user if match
    if (!user) {
      errors.email = "User not found";
      console.log("User is not found with this email");
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT payload

        // Sign Token
        jwt.sign(payload, keys.secretKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "bearer " + token // bearer in v4 {https://stackoverflow.com/questions/45897044/passport-jwt-401-unauthorized}
          });
        });
      } else {
        errors.password = "Sorry, password is incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

/**
 *  @route  GET api/users/current
 *  @desc   Return the curren tuser
 *  @access Private
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
module.exports = router;
