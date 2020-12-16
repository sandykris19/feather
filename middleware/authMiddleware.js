const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check json web if exists and then verify
  if (token) {
    jwt.verify(token, "super secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.render("index", { message: "Please Login" });
      } else {
        // console.log(decodedToken);
        res.locals.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect("index");
  }
};

//auth middleware

module.exports = requireAuth;
