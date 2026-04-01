const { Blog, User } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const { Op } = require("sequelize");
const { sequelize } = require("../util/db");
const router = require("express").Router();

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

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

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      userId: req.decodedToken.id,
    });
    return res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (req.decodedToken.id !== req.blog.userId) {
      return res
        .status(401)
        .json({ error: "User is not allowed to delete the blog" });
    }
    await req.blog.destroy();
    res.status(200).send("Blog deleted");
  } catch (error) {
    next(error);
  }
});

router.put("/:id", blogFinder, async (req, res, next) => {
  console.log(req.params.id);
  try {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
