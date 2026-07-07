const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");

const User = db.user;
const Role = db.role;

const normalizeRoleName = (role) => {
  const value = (role || "customer").toString().trim().toLowerCase();
  if (value === "user" || value === "customer") return "customer";
  if (value === "seller" || value === "moderator") return "seller";
  if (value === "admin") return "admin";
  return value;
};

const ensureRoles = async (requestedRoles) => {
  const roleNames = Array.from(new Set(requestedRoles.map(normalizeRoleName)));
  const existingRoles = await Role.find({ name: { $in: roleNames } });
  const existingRoleNames = new Set(existingRoles.map((role) => role.name));

  for (const roleName of roleNames) {
    if (!existingRoleNames.has(roleName)) {
      const createdRole = await Role.create({ name: roleName });
      existingRoleNames.add(createdRole.name);
    }
  }

  return Role.find({ name: { $in: roleNames } });
};

const formatUserResponse = (user) => {
  const authorities = (user.roles || []).map((role) => `ROLE_${role.name.toUpperCase()}`);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    country: user.country || "",
    bio: user.bio || "",
    companyName: user.companyName || "",
    roles: authorities,
    accessToken: user.accessToken
  };
};

exports.signup = async (req, res) => {
  try {
    const normalizedRoles = (req.body.roles || (req.body.role ? [req.body.role] : [])).map(normalizeRoleName);
    const roles = normalizedRoles.length ? normalizedRoles : ["customer"];
    const foundRoles = await ensureRoles(roles);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      fullName: req.body.fullName || "",
      phone: req.body.phone || "",
      address: req.body.address || "",
      city: req.body.city || "",
      country: req.body.country || "",
      bio: req.body.bio || "",
      companyName: req.body.companyName || "",
      roles: foundRoles.map((role) => role._id)
    });

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
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }]
    }).populate("roles", "-__v");

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

    const response = formatUserResponse({ ...user.toObject(), accessToken: token });

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Some error occurred while signing in."
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const token = req.headers["x-access-token"] || req.headers["authorization"] || "";
    const response = formatUserResponse({ ...user.toObject(), accessToken: token.startsWith("Bearer ") ? token.slice(7) : token });
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Some error occurred while loading account." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const updates = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      bio: req.body.bio,
      companyName: req.body.companyName
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, { new: true }).populate("roles", "-__v");
    return res.status(200).send(formatUserResponse(updatedUser.toObject()));
  } catch (err) {
    return res.status(500).send({ message: err.message || "Some error occurred while updating profile." });
  }
};

exports.analytics = async (req, res) => {
  try {
    const users = await User.find().populate("roles", "-__v");

    const counts = users.reduce(
      (acc, user) => {
        const roles = (user.roles || []).map((role) => role.name.toLowerCase());
        if (roles.includes("admin")) acc.admins += 1;
        if (roles.includes("seller")) acc.sellers += 1;
        if (roles.includes("customer")) acc.customers += 1;
        return acc;
      },
      { admins: 0, sellers: 0, customers: 0 }
    );

    return res.status(200).send({
      totalUsers: users.length,
      ...counts
    });
  } catch (err) {
    return res.status(500).send({ message: err.message || "Some error occurred while loading analytics." });
  }
};

exports.signout = (req, res) => {
  req.session = null;
  return res.status(200).send({ message: "You've been signed out!" });
};
