import { ObjectId, type Document, type WithId } from "mongodb";
import { getDb } from "./mongodb";
import { seedDestinations } from "./seed-data";
import type { Destination } from "./types";

const COLLECTION = "destinations";

function toDestination(doc: WithId<Document>): Destination {
  return {
    id: doc._id.toString(),
    name: doc.name,
    hotelCount: doc.hotelCount,
    image: doc.image,
  };
}

// Veritabanına bağlanılamazsa örnek verilere düşer; genel (public) sayfalarda kullanılır.
export async function getDestinations(): Promise<Destination[]> {
  try {
    return await getDestinationsOrThrow();
  } catch (error) {
    console.warn("[mongodb] Bölgeler alınamadı, örnek veriler gösteriliyor:", (error as Error).message);
    return seedDestinations;
  }
}

// Bağlantı hatasını yutmaz; admin panelinde gerçek veri/durum ayrımını korumak için kullanılır.
export async function getDestinationsOrThrow(): Promise<Destination[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();
  return docs.map(toDestination);
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toDestination(doc) : null;
}

export async function createDestination(input: Omit<Destination, "id">): Promise<string> {
  const db = await getDb();
  const now = new Date();
  const result = await db.collection(COLLECTION).insertOne({ ...input, createdAt: now, updatedAt: now });
  return result.insertedId.toString();
}

export async function updateDestination(id: string, input: Omit<Destination, "id">): Promise<void> {
  const db = await getDb();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...input, updatedAt: new Date() } });
}

export async function deleteDestination(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

export async function countDestinations(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}
