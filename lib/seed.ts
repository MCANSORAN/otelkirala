import { getDb } from "./mongodb";
import { seedHotels, seedDestinations, seedTestimonials } from "./seed-data";

type SeedResult = { hotels: number; destinations: number; testimonials: number };

// Yalnızca boş koleksiyonlara örnek veri ekler; var olan verinin üzerine yazmaz.
export async function seedDatabase(): Promise<SeedResult> {
  const db = await getDb();
  const now = new Date();
  const result: SeedResult = { hotels: 0, destinations: 0, testimonials: 0 };

  if ((await db.collection("hotels").countDocuments()) === 0) {
    const docs = seedHotels.map(({ id, ...rest }) => {
      void id;
      return { ...rest, createdAt: now, updatedAt: now };
    });
    const { insertedCount } = await db.collection("hotels").insertMany(docs);
    result.hotels = insertedCount;
  }

  if ((await db.collection("destinations").countDocuments()) === 0) {
    const docs = seedDestinations.map(({ id, ...rest }) => {
      void id;
      return { ...rest, createdAt: now, updatedAt: now };
    });
    const { insertedCount } = await db.collection("destinations").insertMany(docs);
    result.destinations = insertedCount;
  }

  if ((await db.collection("testimonials").countDocuments()) === 0) {
    const docs = seedTestimonials.map(({ id, ...rest }) => {
      void id;
      return { ...rest, createdAt: now, updatedAt: now };
    });
    const { insertedCount } = await db.collection("testimonials").insertMany(docs);
    result.testimonials = insertedCount;
  }

  return result;
}
