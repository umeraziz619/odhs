const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const electricianSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Electrician = mongoose.model("Electrician", electricianSchema);

module.exports = Electrician;
