const mongoose = require("mongoose");

const publicSchema = mongoose.Schema({
  profile: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Public = mongoose.model("public", publicSchema);

module.exports = Public;
