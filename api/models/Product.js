import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
  desc: {
    type: String,
  },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
