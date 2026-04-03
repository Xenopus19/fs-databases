
const { User, Blog, ReadingList } = require("../models");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ["author", "url", "title", "likes"],
      through: {
        attributes: ["read"],
      },
    },
  });

  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    user.name = req.body.name;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const where = {}

    if(req.query.read !== undefined){
      where.read = req.query.read
    }
    const user = await User.findByPk(req.params.id,{
      include: {
        model: Blog,
        through:{
          attributes: ['read', 'id'],
          where,
          as: 'reading_list'
        },
        attributes: { 
          exclude: ['createdAt', 'updatedAt', 'userId'] 
        },
      }
    });

    if(!user)
    {
      res.status(404).send(`User with id ${req.params.id} not found`)
    }
    const userJson = user.toJSON();
    
    userJson.readings = userJson.blogs;
    delete userJson.blogs;

    res.json(userJson);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
