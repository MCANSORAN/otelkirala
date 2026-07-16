import { ObjectId, type Document, type WithId } from "mongodb";
import { getDb } from "./mongodb";
import { seedTestimonials } from "./seed-data";
import type { Testimonial } from "./types";

const COLLECTION = "testimonials";

function toTestimonial(doc: WithId<Document>): Testimonial {
  return {
    id: doc._id.toString(),
    name: doc.name,
    location: doc.location,
    avatar: doc.avatar,
    quote: doc.quote,
    rating: doc.rating,
  };
}

// Veritabanına bağlanılamazsa örnek verilere düşer; genel (public) sayfalarda kullanılır.
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await getTestimonialsOrThrow();
  } catch (error) {
    console.warn("[mongodb] Yorumlar alınamadı, örnek veriler gösteriliyor:", (error as Error).message);
    return seedTestimonials;
  }
}

// Bağlantı hatasını yutmaz; admin panelinde gerçek veri/durum ayrımını korumak için kullanılır.
export async function getTestimonialsOrThrow(): Promise<Testimonial[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();
  return docs.map(toTestimonial);
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toTestimonial(doc) : null;
}

export async function createTestimonial(input: Omit<Testimonial, "id">): Promise<string> {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection(COLLECTION).insertOne({ ...input, createdAt: now, updatedAt: now });
  return result.insertedId.toString();
}

export async function updateTestimonial(id: string, input: Omit<Testimonial, "id">): Promise<void> {
  const db = await getDb();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...input, updatedAt: new Date() } });
}

export async function deleteTestimonial(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

export async function countTestimonials(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}
