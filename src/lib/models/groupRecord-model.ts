import mongoose from "mongoose";

const groupRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  records: [{ type: mongoose.Types.ObjectId, ref: "Record" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const GroupRecord =
  mongoose.models.GroupRecord ||
  mongoose.model("GroupRecord", groupRecordSchema);

export default GroupRecord;
