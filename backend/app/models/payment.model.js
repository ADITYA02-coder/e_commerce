module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: "INR"
      },
      paymentMethod: {
        type: String,
        enum: ["credit_card", "debit_card", "net_banking", "upi", "upi_qr", "cod", "wallet"],
        required: true
      },
      transactionId: {
        type: String
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
      },
      details: {
        last4: String,
        brand: String,
        upiId: String,
        payerName: String,
        qrReference: String
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Payment = mongoose.model("Payment", schema);
  return Payment;
};
