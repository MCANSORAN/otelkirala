import { ObjectId, type Document, type WithId } from "mongodb";
import { getDb } from "@/database/mongodb";
import type { ReservationRequest, ReservationStatus } from "@/types";

const COLLECTION = "requests";

const STATUSES: ReservationStatus[] = ["new", "contacted", "closed"];

function toRequest(doc: WithId<Document>): ReservationRequest {
  return {
    id: doc._id.toString(),
    hotelId: typeof doc.hotelId === "string" ? doc.hotelId : "",
    hotelName: typeof doc.hotelName === "string" ? doc.hotelName : "",
    roomId: typeof doc.roomId === "string" ? doc.roomId : undefined,
    roomName: typeof doc.roomName === "string" ? doc.roomName : undefined,
    fullName: typeof doc.fullName === "string" ? doc.fullName : "",
    phone: typeof doc.phone === "string" ? doc.phone : "",
    email: typeof doc.email === "string" ? doc.email : undefined,
    checkIn: typeof doc.checkIn === "string" ? doc.checkIn : undefined,
    checkOut: typeof doc.checkOut === "string" ? doc.checkOut : undefined,
    guests: typeof doc.guests === "number" ? doc.guests : 1,
    children: typeof doc.children === "number" ? doc.children : 0,
    roomCount: typeof doc.roomCount === "number" ? doc.roomCount : undefined,
    totalPrice: typeof doc.totalPrice === "number" ? doc.totalPrice : undefined,
    message: typeof doc.message === "string" ? doc.message : undefined,
    status: STATUSES.includes(doc.status) ? doc.status : "new",
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : new Date().toISOString(),
  };
}

// Bağlantı hatasını yutmaz; admin panelinde gerçek veri/durum ayrımı için kullanılır.
export async function getRequestsOrThrow(): Promise<ReservationRequest[]> {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();
  return docs.map(toRequest);
}

export async function getRequestById(id: string): Promise<ReservationRequest | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toRequest(doc) : null;
}

// Yeni talep, id/status/createdAt dışındaki alanlarla oluşturulur; durum "new" başlar.
export async function createRequest(
  input: Omit<ReservationRequest, "id" | "status" | "createdAt">
): Promise<string> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne({
    ...input,
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function updateRequestStatus(id: string, status: ReservationStatus): Promise<void> {
  const db = await getDb();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
}

export async function deleteRequest(id: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

export async function countRequests(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments();
}

export async function countNewRequests(): Promise<number> {
  const db = await getDb();
  return db.collection(COLLECTION).countDocuments({ status: "new" });
}
