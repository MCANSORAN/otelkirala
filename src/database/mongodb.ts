import { MongoClient, type Db } from "mongodb";

const dbName = process.env.MONGODB_DB || "otelkirala";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

function connect(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI ortam değişkeni tanımlı değil. .env.local dosyasına MongoDB bağlantı adresinizi ekleyin (bkz. .env.example)."
    );
  }
  return new MongoClient(uri).connect();
}

function getClientPromise(): Promise<MongoClient> {
  // Development'ta hot-reload sırasında bağlantının tekrar tekrar açılmasını
  // önlemek için client promise'i globalThis üzerinde saklıyoruz.
  const isDev = process.env.NODE_ENV === "development";
  const cached = isDev ? global._mongoClientPromise : clientPromise;
  if (cached) return cached;

  // Bağlantı başarısız olursa reddedilen promise'i önbellekten temizliyoruz;
  // aksi halde tek bir geçici hata (ağ dalgalanması, Atlas IP izin listesinin
  // gecikmesi vb.) sunucu yeniden başlatılana kadar TÜM istekleri kalıcı olarak
  // başarısız kılar. Böylece bir sonraki istek yeniden bağlanmayı dener.
  const promise = connect().catch((error) => {
    if (isDev) global._mongoClientPromise = undefined;
    else clientPromise = undefined;
    throw error;
  });

  if (isDev) global._mongoClientPromise = promise;
  else clientPromise = promise;
  return promise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
