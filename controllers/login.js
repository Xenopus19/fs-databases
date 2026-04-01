const { User } = require("../models");
const { SECRET } = require("../util/config");
const jwt = require('jsonwebtoken')

const router = require("express").Router();

router.post("/", async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    const isPasswordCorrect = req.body.password === user.password;
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        error: "invalid username or password",
      });
    }

    const userForToken = { username: user.username, id: user.id };

    const token = jwt.sign(userForToken, SECRET);
    res
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
