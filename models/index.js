const Blog = require("./Blog");
const ReadingList = require("./ReadingList");
const Session = require("./Session");
const User = require("./User");

User.hasMany(Blog);
Blog.belongsTo(User);

User.hasMany(Session);
Session.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList })
Blog.belongsToMany(User, { through: ReadingList })

const sync = async () => {
  await User.sync({ alter: true });
  await Blog.sync({ alter: true });
};

//sync();

module.exports = {
  Blog,
  User,
  ReadingList,
  Session
};
