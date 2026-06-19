const db = require("../models");
const Payment = db.payments;

// Process a payment
exports.create = (req, res) => {
  const payment = new Payment({
    orderId: req.body.orderId,
    userId: req.userId,
    amount: req.body.amount,
    currency: req.body.currency || "USD",
    paymentMethod: req.body.paymentMethod,
    transactionId: req.body.transactionId,
    status: "pending"
  });

  payment.save()
    .then(data => {
      res.send({
        message: "Payment initiated",
        paymentId: data._id,
        amount: data.amount,
        status: data.status
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error creating payment"
      });
    });
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
