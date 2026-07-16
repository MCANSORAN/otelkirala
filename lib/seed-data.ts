import type { Hotel, Destination, Testimonial } from "./types";

export const seedHotels: Hotel[] = [
  {
    id: "cennet-koy-resort",
    name: "Cennet Koy Resort & Spa",
    location: "Bodrum, Muğla",
    price: 4250,
    rating: 4.8,
    reviewCount: 1243,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80&auto=format&fit=crop",
    tags: ["Her Şey Dahil", "Özel Plaj"],
  },
  {
    id: "lara-sahil-otel",
    name: "Lara Sahil Otel",
    location: "Antalya",
    price: 3100,
    rating: 4.6,
    reviewCount: 2087,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80&auto=format&fit=crop",
    tags: ["Aile Dostu", "Aquapark"],
  },
  {
    id: "bosphorus-palace",
    name: "Boğaziçi Palace Hotel",
    location: "İstanbul",
    price: 2650,
    rating: 4.7,
    reviewCount: 964,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80&auto=format&fit=crop",
    tags: ["Şehir Merkezi", "Boğaz Manzarası"],
  },
  {
    id: "kapadokya-cave-suites",
    name: "Kapadokya Mağara Suites",
    location: "Nevşehir",
    price: 3850,
    rating: 4.9,
    reviewCount: 731,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80&auto=format&fit=crop",
    tags: ["Balon Turu", "Butik"],
  },
  {
    id: "oludeniz-blue-lagoon",
    name: "Ölüdeniz Blue Lagoon Otel",
    location: "Fethiye, Muğla",
    price: 3400,
    rating: 4.5,
    reviewCount: 1102,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop",
    tags: ["Deniz Manzarası", "Yamaç Paraşütü"],
  },
  {
    id: "marmaris-marina-hotel",
    name: "Marmaris Marina Hotel",
    location: "Marmaris, Muğla",
    price: 2950,
    rating: 4.4,
    reviewCount: 856,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format&fit=crop",
    tags: ["Marina Manzarası", "Gece Hayatı"],
  },
];

export const seedDestinations: Destination[] = [
  {
    id: "antalya",
    name: "Antalya",
    hotelCount: 1840,
    image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "bodrum",
    name: "Bodrum",
    hotelCount: 962,
    image: "https://images.unsplash.com/photo-1570214476695-19bd467e6f7a?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "kapadokya",
    name: "Kapadokya",
    hotelCount: 421,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "istanbul",
    name: "İstanbul",
    hotelCount: 2310,
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80&auto=format&fit=crop",
  },
];

export const seedTestimonials: Testimonial[] = [
  {
    id: "elif-yildiz",
    name: "Elif Yıldız",
    location: "Ankara",
    avatar: "https://i.pravatar.cc/150?img=47",
    quote:
      "OtelKirala sayesinde ailemle harika bir Bodrum tatili geçirdik. Rezervasyon bir dakika bile sürmedi ve fiyatlar gerçekten uygundu.",
    rating: 5,
  },
  {
    id: "mert-kaya",
    name: "Mert Kaya",
    location: "İzmir",
    avatar: "https://i.pravatar.cc/150?img=12",
    quote:
      "Kapadokya'daki mağara otel önerisi tam isabet oldu. Müşteri desteği de her sorumda çok hızlı döndü.",
    rating: 5,
  },
  {
    id: "zeynep-aydin",
    name: "Zeynep Aydın",
    location: "Bursa",
    avatar: "https://i.pravatar.cc/150?img=32",
    quote:
      "Karşılaştırma ekranı sayesinde en iyi fiyatı kolayca buldum. Artık tatil planlarken ilk baktığım site.",
    rating: 4,
  },
];
