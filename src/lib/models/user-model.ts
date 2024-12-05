import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  store: { type: String, required: true },
  photo: { type: String, default: null },
  phone: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
