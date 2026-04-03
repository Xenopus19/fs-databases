const { Session } = require("../models");

const sessionCheck = async (req, res, next) => {
  if (!req.decodedToken) {
    console.log("No decocded token found");
    return res.status(401).send("No valid token found");
  }
  const session = await Session.findOne({
    where: { token: req.get("authorization").substring(7), expired: false },
  });

  if (!session) {
    console.log("No valid session exists");
    return res.status(401).send("No valid session exists");
  }
  if (session.expired === true) {
    console.log("Session is expired");
    return res.status(401).send("Session is expired");
  }
  next();
};
module.exports = sessionCheck;
