import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  product: { type: String, required: false },
  quantity: { type: Number, default: null },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  groupId: { type: mongoose.Types.ObjectId, ref: "GroupRecord", default: null },
});

const Record = mongoose.models.Record || mongoose.model("Record", recordSchema);

export default Record;
