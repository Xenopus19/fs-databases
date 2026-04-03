const { Blog, User } = require("../models");
const { Op } = require("sequelize");
const { tokenExtractor } = require("../util/tokenExtractor");
const blogFinder = require("../util/blogFinder");
const sessionCheck = require("../util/sessionCheck");
const router = require("express").Router();

router.post("/", tokenExtractor, sessionCheck, async (req, res, next) => {
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

router.delete("/:id", tokenExtractor, blogFinder, sessionCheck, async (req, res, next) => {
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
