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

// Kullanıcının otel detay sayfasından gönderdiği rezervasyon talebi.
// Admin panelinden takip edilir; durumu ile yönetilir.
export type ReservationStatus = "new" | "contacted" | "closed";

export type ReservationRequest = {
  id: string;
  hotelId: string;
  hotelName: string;
  roomId?: string;
  roomName?: string;
  fullName: string;
  phone: string;
  email?: string;
  checkIn?: string; // "YYYY-MM-DD"
  checkOut?: string;
  guests: number; // yetişkin sayısı
  children: number; // çocuk sayısı
  roomCount?: number; // kapasiteye göre gruplanmış gereken oda sayısı
  totalPrice?: number; // gecelik toplam fiyat (oda fiyatı × oda sayısı)
  message?: string;
  status: ReservationStatus;
  createdAt: string; // ISO string
};

// services/ katmanının döndürdüğü ortak sonuç tipi: doğrulama ve veritabanı
// hatalarını aynı şekilde ele almak için kullanılır.
export type ServiceResult<T = void> = { ok: true; data: T } | { ok: false; error: string };
