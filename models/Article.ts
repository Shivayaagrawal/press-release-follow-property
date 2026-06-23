import mongoose, { Schema, model, models } from "mongoose";

const priceDataSchema = new Schema(
  {
    area: { type: String, required: true },
    ratePerSqft: { type: Number, required: true },
    changePercent: { type: Number, required: true },
    changeDirection: { type: String, enum: ["up", "down"], required: true },
  },
  { _id: false }
);

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    excerpt: { type: String },
    city: {
      type: String,
      enum: ["Delhi", "Gurgaon", "Noida", "NCR"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Residential",
        "Commercial",
        "Govt",
        "Metro",
        "Rates",
        "Buyers",
        "Sellers",
        "Investors",
      ],
      required: true,
    },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBreaking: { type: Boolean, default: false },
    author: { type: String, default: "Property Desk" },
    publishedAt: { type: Date, default: Date.now },
    priceData: priceDataSchema,
  },
  { timestamps: true }
);

export type ArticleDocument = mongoose.InferSchemaType<typeof articleSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Article =
  models.Article ?? model("Article", articleSchema);
