const { Blog } = require("../models");


const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id);
    if (!req.blog) {
      const error = new Error("BlogNotFound");
      error.name = "BlogNotFound";
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = blogFinder