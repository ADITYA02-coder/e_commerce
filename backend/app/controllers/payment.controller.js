const db = require("../models");
const Payment = db.payments;
const Order = db.orders;

const generateTransactionId = (method) =>
  `${String(method || "pay").toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const buildPaymentStatus = (method, requestedStatus) => {
  if (method === "cod") return "pending";
  if (requestedStatus === "failed") return "failed";
  if (requestedStatus === "completed") return "completed";
  return "pending";
};

const buildOrderPaymentStatus = (method, paymentStatus) => {
  if (method === "cod") return "pending";
  if (paymentStatus === "completed") return "paid";
  if (paymentStatus === "failed") return "failed";
  return "pending";
};

// Process a payment
exports.create = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    if (String(order.userId) !== String(req.userId)) {
      return res.status(403).send({ message: "You can only pay for your own order" });
    }

    const method = req.body.paymentMethod;
    const status = buildPaymentStatus(method, req.body.status);
    const transactionId = req.body.transactionId || (status === "completed" ? generateTransactionId(method) : undefined);

    const payment = await Payment.create({
      orderId: req.body.orderId,
      userId: req.userId,
      amount: req.body.amount || order.totalAmount,
      currency: req.body.currency || "INR",
      paymentMethod: method,
      transactionId,
      status,
      details: req.body.details || {}
    });

    await Order.findByIdAndUpdate(order._id, {
      paymentStatus: buildOrderPaymentStatus(method, status),
      orderStatus: "processing"
    });

    return res.status(201).send({
      message: status === "completed" ? "Payment completed" : "Payment initiated",
      paymentId: payment._id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      orderPaymentStatus: buildOrderPaymentStatus(method, status)
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error creating payment"
    });
  }
};

exports.confirm = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }

    if (String(payment.userId) !== String(req.userId)) {
      return res.status(403).send({ message: "You can only confirm your own payment" });
    }

    const status = payment.paymentMethod === "cod" ? "pending" : (req.body.status || "completed");
    payment.status = status;
    payment.transactionId = req.body.transactionId || payment.transactionId || (status === "completed" ? generateTransactionId(payment.paymentMethod) : undefined);
    payment.details = { ...(payment.details || {}), ...(req.body.details || {}) };
    await payment.save();

    const orderPaymentStatus = buildOrderPaymentStatus(payment.paymentMethod, status);
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: orderPaymentStatus,
      orderStatus: "processing"
    });

    return res.send({
      message: "Payment status updated",
      paymentId: payment._id,
      transactionId: payment.transactionId,
      status: payment.status,
      orderPaymentStatus
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error confirming payment"
    });
  }
};

// Get payment details
exports.findOne = (req, res) => {
  Payment.findById(req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "Payment not found" });
      }
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving payment"
      });
    });
};

// Get user's payments
exports.findByUser = (req, res) => {
  Payment.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving payments"
      });
    });
};

// Update payment status (after webhook from payment gateway)
exports.updateStatus = (req, res) => {
  const status = req.body.status; // "completed" or "failed"
  const transactionId = req.body.transactionId;

  Payment.findByIdAndUpdate(
    req.params.id,
    { status: status, transactionId: transactionId }
  )
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: "Payment not found" });
      }

      // If payment completed, update order status
      if (status === "completed") {
        db.orders.findByIdAndUpdate(
          data.orderId,
          { paymentStatus: "paid" }
        ).catch(err => console.log("Error updating order:", err));
      } else if (status === "failed") {
        db.orders.findByIdAndUpdate(
          data.orderId,
          { paymentStatus: "failed" }
        ).catch(err => console.log("Error updating order:", err));
      }

      res.send({ message: "Payment status updated" });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error updating payment"
      });
    });
};

// Get all payments (admin)
exports.findAll = (req, res) => {
  Payment.find()
    .sort({ createdAt: -1 })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving payments"
      });
    });
};
