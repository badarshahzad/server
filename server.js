const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const home = require("./routes/api/home");

const app = express(); //initiale

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDD is connected"))
  .catch(err => console.log("err"));

// Passport middleware
app.use(passport.initialize());

// Passport config {jwt strategy}
require("./config/passport")(passport);

// Use Routes
app.use("/", home);
app.use("/api/users", users);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
