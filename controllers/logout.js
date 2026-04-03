const { User } = require("../models");
const Session = require("../models/Session");
const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");
const { tokenExtractor } = require("../util/tokenExtractor");

const router = require("express").Router();

router.delete("/", tokenExtractor, async (req, res, next) => {
  try {
    await Session.update(
      { expired: true }, 
      {
        where: {
          userId: req.decodedToken.id,
          expired: false,
        },
      },
    );

    res.status(204).send("All user sessions were expired.");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
