const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");

const User = db.user;
const Role = db.role;

exports.signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    const roles = req.body.roles?.length ? req.body.roles : ["user"];
    const foundRoles = await Role.find({ name: { $in: roles } });
    user.roles = foundRoles.map(role => role._id);

    await user.save();
    return res.send({ message: "User was registered successfully!" });
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Some error occurred while registering the user."
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400
    });

    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Some error occurred while signing in."
    });
  }
};

exports.signout = (req, res) => {
  req.session = null;
  return res.status(200).send({ message: "You've been signed out!" });
};
