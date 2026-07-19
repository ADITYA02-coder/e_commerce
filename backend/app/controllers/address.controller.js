const db = require("../models");
const Address = db.addresses;

exports.create = (req, res) => {
  if (!req.userId) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const address = new Address({
    userId: req.userId,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city,
    district: req.body.district,
    state: req.body.state,
    pin: req.body.pin,
    mobile: req.body.mobile,
    active: req.body.active ?? true
  });

  address
    .save()
    .then(data => res.status(201).send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the address."
      });
    });
};

exports.findAll = (req, res) => {
  const condition = { userId: req.userId };

  Address.find(condition)
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving addresses."
      });
    });
};

exports.findOne = async (req, res) => {
  try {
    const data = await Address.findById(req.params.id);
    if (!data) {
      return res.status(404).send({ message: `Address not found with id=${req.params.id}` });
    }
    if (String(data.userId) !== String(req.userId)) {
      return res.status(403).send({ message: "You can only access your own addresses" });
    }

    return res.send(data);
  } catch {
    return res.status(500).send({ message: `Error retrieving address with id=${req.params.id}` });
  }
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty!" });
  }

  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).send({ message: `Address not found with id=${req.params.id}` });
    }
    if (String(address.userId) !== String(req.userId)) {
      return res.status(403).send({ message: "You can only update your own addresses" });
    }

    delete req.body.userId;
    const data = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.send(data);
  } catch {
    return res.status(500).send({ message: `Error updating address with id=${req.params.id}` });
  }
};

exports.delete = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).send({ message: `Address not found with id=${req.params.id}` });
    }
    if (String(address.userId) !== String(req.userId)) {
      return res.status(403).send({ message: "You can only delete your own addresses" });
    }

    await Address.findByIdAndDelete(req.params.id);
    return res.send({ message: "Address was deleted successfully!" });
  } catch {
    return res.status(500).send({ message: `Could not delete address with id=${req.params.id}` });
  }
};

exports.deleteAll = (req, res) => {
  Address.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} addresses were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing addresses."
      });
    });
};

exports.findAllActive = (req, res) => {
  Address.find({ active: true, userId: req.userId })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving active addresses."
      });
    });
};
