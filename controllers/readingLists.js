const { User, Blog, ReadingList } = require("../models");
const blogFinder = require("../util/blogFinder");
const sessionCheck = require("../util/sessionCheck");
const { tokenExtractor } = require("../util/tokenExtractor");

const router = require("express").Router();

router.post("/", async (req, res, next) => {
  try {
    if (!req.body.userId || !req.body.blogId) {
      return res.status(400).send("Request should have both user and blog Id");
    }
    const user = await User.findByPk(req.body.userId);
    const blog = await Blog.findByPk(req.body.blogId);

    if (!user || !blog) {
      return res.status(404).send("Nonexistent user or blog Id");
    }

    const existingList = await ReadingList.findOne({
      where: { userId: user.id, blogId: blog.id, },
    });

    if (existingList) {
      return res
        .status(400)
        .send("This blog was already added to reading list");
    }

    const readingList = await ReadingList.create(req.body);
    res.json({
      blog_id: readingList.blogId,
      user_id: readingList.userId,
      read: readingList.read,
      id:readingList.id
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", tokenExtractor, sessionCheck, async (req, res, next) => {
  try {
    console.log(req.params.id)
    const readingList = await ReadingList.findByPk(req.params.id);
    if(! readingList)
    {
      return res.status(404).send("Nonexistent reading list");
    }

    if (readingList.userId !== req.decodedToken.id) {
      return res.status(401).send("You can not change the reading value");
    }
    
    readingList.read = req.body.read;
    await readingList.save();
    res.json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
