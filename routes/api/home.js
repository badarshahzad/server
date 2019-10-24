const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Profile Model
const Profile = require("../../models/Profile");

/**
 *  @route  GET api/profile
 *  @desc   GET current users profile
 *  @access Private
 */
router.get("/", (req, res) => {
  res.json("Hi, this is the api server is working fine.");
});

module.exports = router;
