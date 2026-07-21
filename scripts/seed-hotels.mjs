// Toplu otel üretici / seed script'i.
//
// Kullanım (proje kökünden):
//   node scripts/seed-hotels.mjs            -> 100 otel üretir (önceki bulk-seed kayıtlarını yeniler)
//   node scripts/seed-hotels.mjs 50         -> 50 otel üretir
//   node scripts/seed-hotels.mjs --check    -> yalnızca bağlantıyı ve mevcut sayıyı raporlar
//
// Ürettiği her doküman `source: "bulk-seed"` ile işaretlenir; script tekrar
// çalıştığında SADECE bu işaretli kayıtları siler; admin panelinden elle
// eklenen oteller korunur. Şema src/types Hotel tipiyle birebir uyumludur.
// Resimler next.config.ts'te izinli images.unsplash.com host'undan seçilir.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// --- .env.local'i elle yükle (standalone script Next.js env'ini okumaz) ---
function loadEnv() {
  const p = path.join(ROOT, ".env.local");
  const raw = fs.readFileSync(p, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

// --- Basit, deterministik PRNG (mulberry32) — tekrar çalıştırınca aynı veri ---
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260720);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const chance = (p) => rand() < p;

// --- Görsel havuzu (hepsi images.unsplash.com — next.config allowlist) ---
const PHOTO_IDS = [
  "1590490360182-c33d57733427",
  "1520250497591-112f2f40a3f4",
  "1571896349842-33c89424de2d",
  "1582719508461-905c673771fd",
  "1571003123894-1f0594d2b5d9",
  "1564501049412-61c2a3083791",
  "1527838832700-5059252407fa",
  "1512918728675-ed5a9ecdebfd",
  "1445019980597-93fa8acb246c",
  "1570214476695-19bd467e6f7a",
  "1601918774946-25832a4be0d6",
  "1611892440504-42a792e24d32",
];
const img = (w) => `https://images.unsplash.com/photo-${pick(PHOTO_IDS)}?w=${w}&q=80&auto=format&fit=crop`;

// --- Lokasyonlar (Türkiye turizm bölgeleri) ---
const LOCATIONS = [
  "Antalya", "Alanya, Antalya", "Side, Antalya", "Belek, Antalya", "Kaş, Antalya",
  "Bodrum, Muğla", "Fethiye, Muğla", "Marmaris, Muğla", "Datça, Muğla", "Göcek, Muğla",
  "İstanbul", "Nevşehir", "Ürgüp, Nevşehir", "Kuşadası, Aydın", "Didim, Aydın",
  "Çeşme, İzmir", "Alaçatı, İzmir", "Sapanca, Sakarya", "Uludağ, Bursa", "Abant, Bolu",
  "Trabzon", "Ordu", "Amasra, Bartın", "Şanlıurfa", "Gaziantep", "Afyonkarahisar",
  "Pamukkale, Denizli", "Kemer, Antalya", "Sarıgerme, Muğla", "İçmeler, Muğla",
];

// --- İsim bileşenleri ---
const BRANDS = [
  "Cennet", "Deniz", "Palmiye", "Zümrüt", "Altın Kum", "Mavi", "Sedir", "Lale",
  "Zeytin", "İnci", "Safir", "Mercan", "Nilüfer", "Güneş", "Yıldız", "Papatya",
  "Marmara", "Ege", "Akdeniz", "Toros", "Sultan", "Grand", "Royal", "Prestige",
  "Panorama", "Liman", "Kervansaray", "Asmalı",
];
const TYPES = [
  "Resort & Spa", "Beach Resort", "Otel", "Palace Hotel", "Suites", "Konak",
  "Thermal Resort", "Garden Resort", "Boutique Hotel", "Marina Hotel",
  "City Hotel", "Country Resort", "Bay Resort",
];

const TAGS = [
  "Her Şey Dahil", "Ultra Her Şey Dahil", "Özel Plaj", "Aile Dostu", "Aquapark",
  "Deniz Manzarası", "Şehir Merkezi", "Balayı", "Spa & Wellness", "Termal",
  "Butik", "Doğa", "Marina Manzarası", "Balon Turu", "Kayak Merkezi", "Havuzlu",
];

const HALAL_KEYS = ["separatePool", "separateBeach", "halalFood", "noAlcohol", "prayerRoom", "separateSpa"];
const HALAL_PHRASE = {
  separatePool: "kadınlara özel havuz",
  separateBeach: "ayrı plaj alanı",
  halalFood: "helal sertifikalı mutfak",
  noAlcohol: "alkolsüz konsept",
  prayerRoom: "mescit",
  separateSpa: "kadınlara özel spa",
};

const ROOM_TYPES = [
  ["Standart Oda", 2, 1.0],
  ["Ekonomik Oda", 2, 0.85],
  ["Deniz Manzaralı Oda", 2, 1.25],
  ["Aile Odası", 4, 1.4],
  ["Aile Suit", 4, 1.6],
  ["Deluxe Suit", 3, 1.75],
  ["Kral Dairesi", 2, 2.3],
  ["Bahçe Katı Oda", 3, 1.15],
];

function sample(arr, min, max) {
  const n = int(min, Math.min(max, arr.length));
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n; i++) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o")
    .replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const usedNames = new Set();
function uniqueName(city) {
  for (let i = 0; i < 40; i++) {
    const n = `${pick(BRANDS)} ${chance(0.5) ? city + " " : ""}${pick(TYPES)}`;
    if (!usedNames.has(n)) {
      usedNames.add(n);
      return n;
    }
  }
  const fallback = `${pick(BRANDS)} ${city} ${pick(TYPES)} ${usedNames.size + 1}`;
  usedNames.add(fallback);
  return fallback;
}

function makeHotel(index) {
  const location = pick(LOCATIONS);
  const city = location.split(",")[0].trim();
  const name = uniqueName(city);
  const basePrice = int(30, 180) * 50; // 1500 - 9000 TRY
  const halalFeatures = sample(HALAL_KEYS, 1, 5);
  const featureText = halalFeatures.map((k) => HALAL_PHRASE[k]).slice(0, 3).join(", ");

  const rooms = sample(ROOM_TYPES, 2, 4).map(([rname, capacity, mult], i) => ({
    id: `bulk-${index}-room-${i}`,
    name: rname,
    price: Math.round((basePrice * mult) / 50) * 50,
    capacity,
    image: img(800),
  }));

  const description =
    `${city} bölgesinde yer alan ${name}, helal tatil konseptiyle hizmet verir. ` +
    `${featureText} gibi olanaklarıyla misafirlerine huzurlu ve konforlu bir konaklama sunar. ` +
    `Geniş oda seçenekleri ve nitelikli hizmet anlayışıyla hem aileler hem de çiftler için idealdir.`;

  return {
    name,
    location,
    price: basePrice,
    rating: int(41, 49) / 10, // 4.1 - 4.9 (her zaman tek ondalık gösterilir)
    reviewCount: int(120, 3200),
    image: img(1200),
    tags: sample(TAGS, 2, 3),
    description,
    images: Array.from({ length: int(2, 4) }, () => img(1200)),
    halalFeatures,
    rooms,
    source: "bulk-seed",
    createdAt: new Date(Date.now() - index * 3600 * 1000),
    updatedAt: new Date(),
  };
}

// --- Ana akış ---
const env = loadEnv();
const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB || "otelkirala";
if (!uri) {
  console.error("❌ MONGODB_URI tanımlı değil (.env.local).");
  process.exit(1);
}

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const count = Number(args.find((a) => /^\d+$/.test(a))) || 100;

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
try {
  await client.connect();
  const db = client.db(dbName);
  await db.command({ ping: 1 });
  console.log(`✅ Bağlantı başarılı — veritabanı: ${dbName}`);

  const col = db.collection("hotels");
  const before = await col.countDocuments();
  const bulkBefore = await col.countDocuments({ source: "bulk-seed" });
  console.log(`Mevcut hotels dokümanı: ${before} (bunların ${bulkBefore} tanesi bulk-seed)`);

  if (checkOnly) {
    console.log("(--check: yalnızca kontrol, veri yazılmadı)");
  } else {
    const del = await col.deleteMany({ source: "bulk-seed" });
    console.log(`🧹 Önceki bulk-seed kayıtları silindi: ${del.deletedCount}`);

    const hotels = Array.from({ length: count }, (_, i) => makeHotel(i));
    const res = await col.insertMany(hotels);
    console.log(`🏨 Eklenen otel: ${res.insertedCount}`);

    const after = await col.countDocuments();
    console.log(`Toplam hotels dokümanı: ${after}`);
    console.log("Örnek kayıt:", JSON.stringify({ ...hotels[0], createdAt: undefined, updatedAt: undefined }, null, 2));
  }
} catch (err) {
  console.error("❌ Hata:", err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
