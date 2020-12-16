const userrouter = require("express").Router();
const requireAuth = require("../middleware/authMiddleware");
const User = require("../models/user");
const Public = require("../models/public");
const marked = require("marked");
const createDomPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurifier(new JSDOM().window);

userrouter.get("/articles", requireAuth, async (req, res) => {
  const articles = await User.findById({ _id: res.locals.user.id });
  const public = await Public.find({}).sort({ createdAt: -1 }).limit(2);
  res.render("user/articles", { articles: articles, public });
});

userrouter.get("/explore", requireAuth, async (req, res) => {
  let articles = await Public.find({}).sort({ createdAt: -1 });
  res.render("user/explore", { articles });
});

userrouter.get("/new", (req, res) => {
  res.render("user/createNew");
});

userrouter.post("/new", requireAuth, async (req, res) => {
  let publicArticle = await User.findById({ _id: res.locals.user.id });
  publicArticle = publicArticle.email.split("@")[0];
  let public = await Public.create({
    profile: publicArticle,
    title: req.body.title,
    subtitle: req.body.subtitle,
    markdown: dompurify.sanitize(marked(req.body.markdown)),
  });
  let articles = await User.findByIdAndUpdate(
    { _id: res.locals.user.id },
    { $push: { articles: { $each: [req.body], $position: 0 } } },
    { upsert: true }
  );
  articles = await User.findById({ _id: res.locals.user.id });
  public = await Public.find({}).sort({ createdAt: -1 }).limit(2);
  res.render("user/articles", { articles: articles, public });
});

userrouter.get("/profile", requireAuth, async (req, res) => {
  let totalCount = await User.findById({ _id: res.locals.user.id });
  res.render("user/profile", {
    name: totalCount.email.split("@")[0],
    count: totalCount.articles.length,
  });
});

userrouter.get("/edit/:id", requireAuth, async (req, res) => {
  let articles = await User.findById({ _id: res.locals.user.id });
  articles = articles.articles.filter((a) => {
    return a._id == req.params.id;
  });
  console.log(articles[0]);
  res.render("user/edit", { id: req.params.id, articles: articles[0] });
});

userrouter.post("/newedit/:id", requireAuth, async (req, res) => {
  let del = await User.findByIdAndUpdate(
    { _id: res.locals.user.id },
    { $pull: { articles: { _id: req.params.id } } }
  );
  let articles = await User.findByIdAndUpdate(
    { _id: res.locals.user.id },
    { $push: { articles: { $each: [req.body], $position: 0 } } },
    { upsert: true }
  );
  articles = await User.findById({ _id: res.locals.user.id });
  const public = await Public.find({}).sort({ createdAt: -1 }).limit(2);
  res.render("user/articles", { articles: articles, public });
});

userrouter.get("/delete/:id", requireAuth, async (req, res) => {
  let delPublic = await User.findById({ _id: res.locals.user.id });
  delPublic = delPublic.articles[0];
  let articles = await User.findByIdAndUpdate(
    {
      _id: res.locals.user.id,
    },
    { $pull: { articles: { _id: req.params.id } } }
  );
  articles = await User.findById({ _id: res.locals.user.id });
  const publicArticle = await Public.findOneAndDelete({
    title: delPublic.title,
  });
  const public = await Public.find({}).sort({ createdAt: -1 }).limit(2);
  res.render("user/articles", { articles: articles, public });
});

userrouter.get("/read/:id", requireAuth, async (req, res) => {
  let articles = await User.findById({ _id: res.locals.user.id });
  articles = articles.articles.filter((a) => {
    return a._id == req.params.id;
  });
  res.render("user/read", { articles });
});

userrouter.get("/pread/:id", async (req, res) => {
  let articles = await Public.findById({ _id: req.params.id });
  res.render("user/pread", { articles });
});

module.exports = userrouter;
