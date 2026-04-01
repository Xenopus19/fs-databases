const { User, Blog } = require("../models");

const router = require("express").Router();

router.post("/api/reset", async (req, res) => {
  await User.destroy({
    where: {},
    truncate: true,
    cascade: true
  });

  await Blog.destroy({
    where: {},
    truncate: true,
    cascade: true
  });

  return res.status(201).send("DB emptied succesfully.");
});

router.get("/", async (req, res) => {
  return res.status(200).send();
});

module.exports = router;
