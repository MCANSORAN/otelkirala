// Bölge (destination) seed script'i.
//
// Kullanım (proje kökünden):
//   node scripts/seed-destinations.mjs          -> seed bölgelerini ekler/yeniler
//   node scripts/seed-destinations.mjs --check  -> yalnızca bağlantıyı ve mevcut sayıyı raporlar
//
// Ürettiği her doküman `source: "seed"` ile işaretlenir; script tekrar
// çalıştığında SADECE bu işaretli kayıtları siler; admin panelinden elle
// eklenen bölgeler korunur. Şema src/lib/seed-data.ts içindeki seedDestinations
// ve src/types Destination tipiyle birebir uyumludur.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// --- .env.local'i elle yükle (standalone script Next.js env'ini okumaz) ---
function loadEnv() {
  const raw = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

// src/lib/seed-data.ts içindeki seedDestinations ile aynı içerik.
const DESTINATIONS = [
  {
    name: "Antalya",
    hotelCount: 1840,
    image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Bodrum",
    hotelCount: 962,
    image: "https://images.unsplash.com/photo-1570214476695-19bd467e6f7a?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Kapadokya",
    hotelCount: 421,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "İstanbul",
    hotelCount: 2310,
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80&auto=format&fit=crop",
  },
];

const env = loadEnv();
const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB || "otelkirala";
if (!uri) {
  console.error("❌ MONGODB_URI tanımlı değil (.env.local).");
  process.exit(1);
}

const checkOnly = process.argv.slice(2).includes("--check");

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
try {
  await client.connect();
  const db = client.db(dbName);
  await db.command({ ping: 1 });
  console.log(`✅ Bağlantı başarılı — veritabanı: ${dbName}`);

  const col = db.collection("destinations");
  const before = await col.countDocuments();
  const seedBefore = await col.countDocuments({ source: "seed" });
  console.log(`Mevcut destinations dokümanı: ${before} (bunların ${seedBefore} tanesi seed)`);

  if (checkOnly) {
    console.log("(--check: yalnızca kontrol, veri yazılmadı)");
  } else {
    const del = await col.deleteMany({ source: "seed" });
    console.log(`🧹 Önceki seed kayıtları silindi: ${del.deletedCount}`);

    const now = new Date();
    const docs = DESTINATIONS.map((d, i) => ({
      ...d,
      source: "seed",
      createdAt: new Date(now.getTime() - i * 1000),
      updatedAt: now,
    }));
    const res = await col.insertMany(docs);
    console.log(`📍 Eklenen bölge: ${res.insertedCount}`);
    console.log(`Toplam destinations dokümanı: ${await col.countDocuments()}`);
  }
} catch (err) {
  console.error("❌ Hata:", err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
