import { ObjectId, type Document, type WithId } from "mongodb";
import { getDb } from "./mongodb";
import { seedHotels } from "./seed-data";
import type { Hotel } from "./types";

const COLLECTION = "hotels";

function toHotel(doc: WithId<Document>): Hotel {
  return {
    id: doc._id.toString(),
    name: doc.name,
    location: doc.location,
    price: doc.price,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    image: doc.image,
    tags: Array.isArray(doc.tags) ? doc.tags : [],
  };
}

// Veritabanına bağlanılamazsa örnek verilere düşer; genel (public) sayfalarda kullanılır.
export async function getHotels(): Promise<Hotel[]> {
  try {
    return await getHotelsOrThrow();
  } catch (error) {
    console.warn("[mongodb] Oteller alınamadı, örnek veriler gösteriliyor:", (error as Error).message);
    return seedHotels;
  }
}

// Bağlantı hatasını yutmaz; admin panelinde gerçek veri/durum ayrımını korumak için kullanılır.
export async function getHotelsOrThrow(): Promise<Hotel[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();
  return docs.map(toHotel);
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toHotel(doc) : null;
}

export async function createHotel(input: Omit<Hotel, "id">): Promise<string> {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection(COLLECTION).insertOne({ ...input, createdAt: now, updatedAt: now });
  return result.insertedId.toString();
}

export async function updateHotel(id: string, input: Omit<Hotel, "id">): Promise<void> {
  const db = await getDb();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...input, updatedAt: new Date() } });
}

export async function deleteHotel(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

export async function countHotels(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}
