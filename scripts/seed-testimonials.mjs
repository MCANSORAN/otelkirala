// Misafir yorumu (testimonial) seed script'i.
//
// Kullanım (proje kökünden):
//   node scripts/seed-testimonials.mjs          -> seed yorumlarını ekler/yeniler
//   node scripts/seed-testimonials.mjs --check  -> yalnızca bağlantıyı ve mevcut sayıyı raporlar
//
// Ürettiği her doküman `source: "seed"` ile işaretlenir; script tekrar
// çalıştığında SADECE bu işaretli kayıtları siler; admin panelinden elle
// eklenen yorumlar korunur. Şema src/lib/seed-data.ts içindeki seedTestimonials
// ve src/types Testimonial tipiyle birebir uyumludur.

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

// src/lib/seed-data.ts içindeki seedTestimonials ile aynı içerik.
const TESTIMONIALS = [
  {
    name: "Elif Yıldız",
    location: "Ankara",
    avatar: "https://i.pravatar.cc/150?img=47",
    quote:
      "OtelKirala sayesinde ailemle harika bir Bodrum tatili geçirdik. Rezervasyon bir dakika bile sürmedi ve fiyatlar gerçekten uygundu.",
    rating: 5,
    hotelId: "cennet-koy-resort",
  },
  {
    name: "Mert Kaya",
    location: "İzmir",
    avatar: "https://i.pravatar.cc/150?img=12",
    quote:
      "Kapadokya'daki mağara otel önerisi tam isabet oldu. Müşteri desteği de her sorumda çok hızlı döndü.",
    rating: 5,
    hotelId: "kapadokya-cave-suites",
  },
  {
    name: "Zeynep Aydın",
    location: "Bursa",
    avatar: "https://i.pravatar.cc/150?img=32",
    quote:
      "Karşılaştırma ekranı sayesinde en iyi fiyatı kolayca buldum. Artık tatil planlarken ilk baktığım site.",
    rating: 4,
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

  const col = db.collection("testimonials");
  const before = await col.countDocuments();
  const seedBefore = await col.countDocuments({ source: "seed" });
  console.log(`Mevcut testimonials dokümanı: ${before} (bunların ${seedBefore} tanesi seed)`);

  if (checkOnly) {
    console.log("(--check: yalnızca kontrol, veri yazılmadı)");
  } else {
    const del = await col.deleteMany({ source: "seed" });
    console.log(`🧹 Önceki seed kayıtları silindi: ${del.deletedCount}`);

    const now = new Date();
    const docs = TESTIMONIALS.map((t, i) => ({
      ...t,
      source: "seed",
      createdAt: new Date(now.getTime() - i * 1000),
      updatedAt: now,
    }));
    const res = await col.insertMany(docs);
    console.log(`💬 Eklenen yorum: ${res.insertedCount}`);
    console.log(`Toplam testimonials dokümanı: ${await col.countDocuments()}`);
  }
} catch (err) {
  console.error("❌ Hata:", err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
