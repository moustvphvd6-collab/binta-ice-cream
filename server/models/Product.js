import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    pack: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    boxPrice: { type: Number, required: true, min: 0 },
    swatch: { type: [String], default: [] },
    imageUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

// N'expose jamais les champs internes Mongo inutiles au frontend
productSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Product", productSchema);
