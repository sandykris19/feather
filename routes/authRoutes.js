const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//Handling errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let error = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    error.email = "This email id is not registered";
  }

  if (err.message === "incorrect password") {
    error.email = "Your password does not match with email id";
  }

  if (err.code === 11000) {
    error.email = "That email is already taken";
    return error;
  }
  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

//creating jwt and token
const maxAge = 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "super secret", { expiresIn: maxAge });
};

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.create({ email, password });
    res.render("index", {
      message: "You've Successfully created your account, Please login",
      emails: null,
      passwords: null,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.render("signup", { emails: errors.email, passwords: errors.password });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    console.log(user);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/user/explore");
  } catch (err) {
    const errors = handleErrors(err);
    res.render("index", {
      message: null,
      emails: errors.email,
      passwords: errors.password,
    });
    // console.log(err);
  }
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

module.exports = router;
