module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      title: {
        type: String,
        required: true
      },
      comment: {
        type: String
      },
      helpful: {
        type: Number,
        default: 0
      },
      verified: {
        type: Boolean,
        default: false // True if user purchased the product
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Review = mongoose.model("Review", schema);
  return Review;
};
