import { ObjectId, type Document, type WithId } from "mongodb";
import { unstable_cache } from "next/cache";
import { getDb } from "@/database/mongodb";
import { seedTestimonials } from "@/lib/seed-data";
import type { Testimonial } from "@/types";

const COLLECTION = "testimonials";

function toTestimonial(doc: WithId<Document>): Testimonial {
  return {
    id: doc._id.toString(),
    name: doc.name,
    location: doc.location,
    avatar: doc.avatar,
    quote: doc.quote,
    rating: doc.rating,
    hotelId: typeof doc.hotelId === "string" ? doc.hotelId : undefined,
  };
}

// Genel sayfalar için yorumları Next veri önbelleğinde tutar (revalidate + "testimonials"
// etiketi); admin değişikliğinde revalidateTag("testimonials") ile tazelenir.
const getCachedTestimonials = unstable_cache(getTestimonialsOrThrow, ["public-testimonials"], {
  tags: ["testimonials"],
  revalidate: 300,
});

// Veritabanına bağlanılamazsa örnek verilere düşer; genel (public) sayfalarda kullanılır.
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await getCachedTestimonials();
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

// Otele göre yorumlar; hotelId cache anahtarına dahil olur, "testimonials" etiketiyle tazelenir.
const getCachedTestimonialsByHotelId = unstable_cache(
  async (hotelId: string): Promise<Testimonial[]> => {
    const db = await getDb();
    const docs = await db.collection(COLLECTION).find({ hotelId }).sort({ createdAt: -1 }).toArray();
    return docs.map(toTestimonial);
  },
  ["public-testimonials-by-hotel"],
  { tags: ["testimonials"], revalidate: 300 }
);

// Veritabanına bağlanılamazsa örnek verilerde filtreler; otel detay sayfasında kullanılır.
export async function getTestimonialsByHotelId(hotelId: string): Promise<Testimonial[]> {
  try {
    return await getCachedTestimonialsByHotelId(hotelId);
  } catch (error) {
    console.warn("[mongodb] Yorumlar alınamadı, örnek verilerde aranıyor:", (error as Error).message);
    return seedTestimonials.filter((testimonial) => testimonial.hotelId === hotelId);
  }
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
