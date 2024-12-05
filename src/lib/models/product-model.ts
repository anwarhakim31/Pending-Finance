import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: null },
  discountQuantity: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
