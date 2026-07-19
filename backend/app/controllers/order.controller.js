const db = require("../models");

const Order = db.orders;
const Product = db.products;
const User = db.user;
const Role = db.role;

const getUserRoles = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return [];

  const roles = await Role.find({ _id: { $in: user.roles || [] } });
  return roles.map((role) => role.name);
};

const getVisibleOrderFilter = async (req) => {
  const roles = await getUserRoles(req.userId);

  if (roles.includes("admin")) {
    return {};
  }

  if (roles.includes("seller")) {
    const sellerProducts = await Product.find({ userId: req.userId }).select("_id");
    const productIds = sellerProducts.map((product) => product._id);
    return { "items.productId": { $in: productIds } };
  }

  return { userId: req.userId };
};

const canAccessOrder = async (req, order) => {
  const filter = await getVisibleOrderFilter(req);
  if (!Object.keys(filter).length) return true;

  if (filter.userId) {
    return String(order.userId) === String(filter.userId);
  }

  const allowedProductIds = new Set((filter["items.productId"].$in || []).map(String));
  return (order.items || []).some((item) => allowedProductIds.has(String(item.productId)));
};

exports.create = async (req, res) => {
  if (!req.body.items || req.body.items.length === 0) {
    return res.status(400).send({
      message: "Order must include at least one item."
    });
  }

  try {
    const totalAmount = req.body.items.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 0);
    }, 0);

    const order = await Order.create({
      userId: req.userId,
      addressId: req.body.addressId,
      active: req.body.active !== false,
      items: req.body.items,
      totalAmount,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      district: req.body.district,
      state: req.body.state,
      pin: req.body.pin,
      mobile: req.body.mobile,
      paymentStatus: req.body.paymentStatus || "pending",
      orderStatus: req.body.orderStatus || "processing"
    });

    return res.status(201).send(order);
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Some error occurred while creating the order."
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const filter = await getVisibleOrderFilter(req);
    const data = await Order.find(filter).sort({ createdAt: -1 });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Some error occurred while retrieving orders."
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    const allowed = await canAccessOrder(req, order);
    if (!allowed) {
      return res.status(403).send({ message: "You do not have access to this order" });
    }

    return res.send(order);
  } catch (err) {
    return res.status(500).send({ message: "Error retrieving Order with id=" + req.params.id });
  }
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty!" });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        message: `Cannot update Order with id=${req.params.id}. Maybe it was not found!`
      });
    }

    const roles = await getUserRoles(req.userId);
    const isAdmin = roles.includes("admin");
    const isSeller = roles.includes("seller");
    const isOwner = String(order.userId) === String(req.userId);
    const canSee = await canAccessOrder(req, order);

    if (!isAdmin && !isSeller && !isOwner) {
      return res.status(403).send({ message: "You do not have access to this order" });
    }

    if (isSeller && !canSee) {
      return res.status(403).send({ message: "You can only update orders for your products" });
    }

    const update = {};
    if (isAdmin || isSeller) {
      if (req.body.orderStatus) update.orderStatus = req.body.orderStatus;
    }
    if (isAdmin || isOwner) {
      if (req.body.paymentStatus) update.paymentStatus = req.body.paymentStatus;
    }

    if (!Object.keys(update).length) {
      return res.status(403).send({ message: "No permitted order fields supplied" });
    }

    const data = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({
      message: "Error updating Order with id=" + req.params.id
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await Order.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).send({
        message: `Cannot delete Order with id=${req.params.id}. Maybe it was not found!`
      });
    }

    return res.send({ message: "Order was deleted successfully!" });
  } catch (err) {
    return res.status(500).send({
      message: "Could not delete Order with id=" + req.params.id
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const data = await Order.deleteMany({});
    return res.send({ message: `${data.deletedCount} Orders were deleted successfully!` });
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Some error occurred while removing all orders."
    });
  }
};

exports.findAllActive = async (req, res) => {
  try {
    const filter = await getVisibleOrderFilter(req);
    const data = await Order.find({ ...filter, active: true }).sort({ createdAt: -1 });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Some error occurred while retrieving active orders."
    });
  }
};
