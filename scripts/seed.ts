import { config } from "dotenv";
import mongoose from "mongoose";
import { Article } from "../models/Article";
import { FALLBACK_ARTICLES } from "../lib/data";

config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI in .env.local before running seed.");
  process.exit(1);
}

async function seed() {
  if (!uri) throw new Error("MONGODB_URI missing");
  await mongoose.connect(uri);
  const count = await Article.countDocuments();
  if (count > 0) {
    console.log(`Database already has ${count} articles. Skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  await Article.insertMany(
    FALLBACK_ARTICLES.map(({ _id, ...rest }) => ({
      ...rest,
      publishedAt: new Date(rest.publishedAt),
    }))
  );

  console.log(`Seeded ${FALLBACK_ARTICLES.length} articles.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
