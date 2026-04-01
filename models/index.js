const Blog = require("./Blog");
const User = require("./User");

User.hasMany(Blog);
Blog.belongsTo(User);

const sync = async () => {
  await User.sync({ alter: true });
  await Blog.sync({ alter: true });
};

sync();

module.exports = {
  Blog,
  User,
};
