const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// firstName: "",
// 		lastName:"",
// 		titleRole:"",
// 		other:"",
// 		institutionName:"",
// 		username:"",
// 		email: "",
// 		password: "",
// 		password2: "",
// Create Schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  titleRole: {
    type: String,
    required: true
  },
  other: {
    type: String,
    required: true
  },
  institutionName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  password2: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: String,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
