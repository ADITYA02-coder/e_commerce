const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    const emailUser = await User.findOne({ email: req.body.email });
    if (emailUser) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message || err });
  }
};

const checkRolesExisted = (req, res, next) => {
  const requestedRoles = req.body.roles || (req.body.role ? [req.body.role] : []);

  if (requestedRoles.length > 0) {
    for (let i = 0; i < requestedRoles.length; i++) {
      const roleName = requestedRoles[i].toLowerCase();
      if (!ROLES.includes(roleName)) {
        res.status(400).send({
          message: `Failed! Role ${requestedRoles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
