const jwt = require('jsonwebtoken');
const { Blog } = require('../models');
const { sequelize } = require('../util/db');

const router = require("express").Router();

router.get("/", async (req, res, next) => {
    const blogs = await Blog.findAll({ 
        group: 'author',
        attributes: ['author', [sequelize.fn('COUNT', sequelize.col('blogs.author')), 'blogs'], [sequelize.fn('SUM', sequelize.col('blogs.likes')), 'likes']],
        order: [['likes', 'DESC']]
     });

    res.status(200).json(blogs)
});

module.exports = router;
