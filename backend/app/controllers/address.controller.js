const db = require("../models");
const Address = db.addresses;

exports.create = (req, res) => {
  if (!req.body.userId) {
    return res.status(400).send({ message: "Address must include userId." });
  }

  const address = new Address({
    userId: req.body.userId,
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
  const condition = req.query.userId ? { userId: req.query.userId } : {};

  Address.find(condition)
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving addresses."
      });
    });
};

exports.findOne = (req, res) => {
  Address.findById(req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `Address not found with id=${req.params.id}` });
      }

      return res.send(data);
    })
    .catch(() => {
      res.status(500).send({ message: `Error retrieving address with id=${req.params.id}` });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty!" });
  }

  Address.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `Address not found with id=${req.params.id}` });
      }

      return res.send(data);
    })
    .catch(() => {
      res.status(500).send({ message: `Error updating address with id=${req.params.id}` });
    });
};

exports.delete = (req, res) => {
  Address.findByIdAndDelete(req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `Address not found with id=${req.params.id}` });
      }

      return res.send({ message: "Address was deleted successfully!" });
    })
    .catch(() => {
      res.status(500).send({ message: `Could not delete address with id=${req.params.id}` });
    });
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
  Address.find({ active: true })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving active addresses."
      });
    });
};
