require("dotenv").config();

const identifier = process.argv[2];

if (!identifier) {
  console.error("Usage: npm run approve-test-seller -- <seller email or username>");
  process.exit(1);
}

const mongoose = require("mongoose");
const db = require("../app/models");

const approveTestSeller = async () => {
  await mongoose.connect(db.url);

  const user = await db.user.findOne({
    $or: [
      { email: identifier },
      { username: identifier }
    ]
  });

  if (!user) {
    throw new Error(`No user found for "${identifier}"`);
  }

  const sellerRole = await db.role.findOne({ name: "seller" });
  if (!sellerRole) {
    throw new Error("Seller role does not exist. Start the backend once so default roles are created.");
  }

  const hasSellerRole = (user.roles || []).some((roleId) => roleId.equals(sellerRole._id));
  if (!hasSellerRole) {
    user.roles = [...(user.roles || []), sellerRole._id];
    await user.save();
  }

  const seller = await db.seller.findOneAndUpdate(
    { user: user._id },
    {
      $set: {
        shopName: `${user.username || "Test"} Store`,
        phone: user.phone || "9876543210",
        address: user.address || "Test Market, New Delhi",
        gstNumber: "29ABCDE1234F1Z5",
        logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        identityDocumentType: "passport",
        identityDocumentNumber: "TEST-PASSPORT-001",
        identityDocumentUrl: "https://example.com/test-passport.pdf",
        bankStatementUrl: "https://example.com/test-bank-statement.pdf",
        liveSelfieUrl: "https://example.com/test-selfie.jpg",
        authorizationLetterUrl: "https://example.com/test-authorization.pdf",
        invoiceUrl: "https://example.com/test-invoice.pdf",
        transparencyCode: "TEST-TRANSPARENCY-001",
        verificationStatus: "approved",
        verificationNotes: "Approved for local product testing.",
        verifiedAt: new Date(),
        isApproved: true
      },
      $setOnInsert: {
        user: user._id
      }
    },
    { new: true, upsert: true }
  );

  console.log(`Approved seller profile for ${user.email || user.username}`);
  console.log(`Seller id: ${seller._id}`);
};

approveTestSeller()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
