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
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connect();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
