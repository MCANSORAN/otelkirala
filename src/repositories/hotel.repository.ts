import { ObjectId, type Document, type WithId } from "mongodb";
import { unstable_cache } from "next/cache";
import { getDb } from "@/database/mongodb";
import { seedHotels } from "@/lib/seed-data";
import { isHalalFeatureKey } from "@/constants/hotel";
import type { Hotel } from "@/types";

const COLLECTION = "hotels";

// Kart görünümü (ana sayfa + otel listesi) yalnızca özet alanları kullanır; açıklama,
// görsel listesi ve oda dizileri karta gitmez. Bu ağır alanları projeksiyonla dışarıda
// bırakarak yanıt boyutunu küçültürüz. toHotel eksik alanları güvenle boş değerlere
// düşürdüğü için dönen nesneler yine geçerli birer Hotel'dir.
const CARD_PROJECTION = { description: 0, images: 0, rooms: 0 } as const;

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
    description: typeof doc.description === "string" ? doc.description : "",
    images: Array.isArray(doc.images) ? doc.images : [],
    halalFeatures: Array.isArray(doc.halalFeatures) ? doc.halalFeatures.filter(isHalalFeatureKey) : [],
    rooms: Array.isArray(doc.rooms) ? doc.rooms : [],
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

// Kart görünümü için hafif (projeksiyonlu) sorgu.
async function getHotelCardsOrThrow(): Promise<Hotel[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({}, { projection: CARD_PROJECTION })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toHotel);
}

// Genel sayfalar için kart verisini Next veri önbelleğinde tutar (revalidate + "hotels"
// etiketi). Böylece her istek MongoDB'ye gitmez; admin tarafındaki değişikliklerde
// revalidateTag("hotels") ile anında tazelenir (bkz. features/admin/actions.ts).
const getCachedHotelCards = unstable_cache(getHotelCardsOrThrow, ["public-hotel-cards"], {
  tags: ["hotels"],
  revalidate: 300,
});

// Ana sayfa ve otel listesi için önbellekli + hafif otel kartları. DB hatasında örnek veri.
export async function getHotelCards(): Promise<Hotel[]> {
  try {
    return await getCachedHotelCards();
  } catch (error) {
    console.warn("[mongodb] Otel kartları alınamadı, örnek veriler gösteriliyor:", (error as Error).message);
    return seedHotels;
  }
}

// Bağlantı hatasını yutmaz; admin panelinde gerçek veri/durum ayrımını korumak için kullanılır.
export async function getHotelByIdOrThrow(id: string): Promise<Hotel | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toHotel(doc) : null;
}

// Tek otelin ham (tüm alanlı) verisini id'ye göre önbellekler; id cache anahtarına
// dahil olur, "hotels" etiketiyle admin değişikliğinde tazelenir.
const getCachedHotelById = unstable_cache(
  async (id: string): Promise<Hotel | null> => {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    return doc ? toHotel(doc) : null;
  },
  ["public-hotel-by-id"],
  { tags: ["hotels"], revalidate: 300 }
);

// Veritabanına bağlanılamazsa veya id örnek veri kimliğiyse örnek verilere düşer; genel (public) sayfalarda kullanılır.
export async function getHotelById(id: string): Promise<Hotel | null> {
  try {
    if (ObjectId.isValid(id)) {
      const hotel = await getCachedHotelById(id);
      if (hotel) return hotel;
    }
  } catch (error) {
    console.warn("[mongodb] Otel alınamadı, örnek verilerde aranıyor:", (error as Error).message);
  }
  return seedHotels.find((hotel) => hotel.id === id) ?? null;
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
