//Imports
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userrouter = require("./routes/userRoutes");
const userRoutes = require("./routes/userRoutes");
const requireAuth = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");

const app = express();

//View Engine
app.set("view engine", "ejs");

//Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

//Database Connection
const dbURI =
  "mongodb+srv://m001-student:m001-password@sandbox.yqnjh.mongodb.net/mediumdata?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("Connected to DB");
  });

app.get("/", (req, res) => {
  res.render("index", { message: null, emails: null, passwords: null });
});

app.get("/signup", (req, res) => {
  res.render("signup", { emails: null, passwords: null });
});

app.get("/about", requireAuth, (req, res) => {
  res.send("In about!");
});
app.get("/home", requireAuth, (req, res) => {
  res.render("home");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening at port 3000");
});
