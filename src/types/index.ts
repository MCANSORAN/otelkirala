export type HalalFeatureKey =
  | "separatePool"
  | "separateBeach"
  | "halalFood"
  | "noAlcohol"
  | "prayerRoom"
  | "separateSpa";

export type Room = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  image: string;
};

export type Hotel = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  description: string;
  images: string[];
  halalFeatures: HalalFeatureKey[];
  rooms: Room[];
};

export type Destination = {
  id: string;
  name: string;
  hotelCount: number;
  image: string;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  avatar: string;
  quote: string;
  rating: number;
  hotelId?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

// services/ katmanının döndürdüğü ortak sonuç tipi: doğrulama ve veritabanı
// hatalarını aynı şekilde ele almak için kullanılır.
export type ServiceResult<T = void> = { ok: true; data: T } | { ok: false; error: string };
