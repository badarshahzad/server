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
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profiel for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
