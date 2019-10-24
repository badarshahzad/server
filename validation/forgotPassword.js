const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateForgotPassword(data) {
  console.log(
    "Data is came into the validity forgot password : " + JSON.stringify(data)
  );

  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors) //when data is valid provide then in parameter null, undefine, empty string passed :)
  };
};
