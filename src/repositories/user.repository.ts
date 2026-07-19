import { ObjectId, type Document, type WithId } from "mongodb";
import { getDb } from "@/database/mongodb";
import type { User } from "@/types";

const COLLECTION = "users";

function toUser(doc: WithId<Document>): User {
  return { id: doc._id.toString(), name: doc.name, email: doc.email };
}

export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ email: email.toLowerCase() });
  return doc ? { ...toUser(doc), passwordHash: doc.passwordHash } : null;
}

export async function getUserById(id: string): Promise<User | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toUser(doc) : null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<string> {
  const db = await getDb();
  const result = await db.collection(COLLECTION).insertOne({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: new Date(),
  });
  return result.insertedId.toString();
}
