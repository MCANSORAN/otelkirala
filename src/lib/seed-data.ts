import type { Hotel, Destination, Testimonial } from "@/types";

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
    description:
      "Bodrum'un sakin koylarından birinde yer alan Cennet Koy Resort & Spa, helal konseple hizmet veren, ayrı kadın/erkek plaj ve havuz alanlarına sahip her şey dahil bir tatil köyüdür. Geniş bahçesi ve özel plajıyla huzurlu bir tatil sunar.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format&fit=crop",
    ],
    halalFeatures: ["separatePool", "separateBeach", "halalFood", "noAlcohol", "prayerRoom"],
    rooms: [
      {
        id: "cennet-koy-standart",
        name: "Standart Oda",
        price: 4250,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "cennet-koy-aile",
        name: "Aile Suit",
        price: 5900,
        capacity: 4,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "cennet-koy-deluxe",
        name: "Deniz Manzaralı Deluxe",
        price: 6800,
        capacity: 3,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80&auto=format&fit=crop",
      },
    ],
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
    description:
      "Lara sahilinde, ailelerin tercih ettiği geniş aquapark alanına sahip Lara Sahil Otel; alkolsüz konseptiyle ve kadınlara özel havuz saatleriyle huzurlu bir aile tatili imkanı sunar.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80&auto=format&fit=crop",
    ],
    halalFeatures: ["separatePool", "noAlcohol", "halalFood"],
    rooms: [
      {
        id: "lara-standart",
        name: "Standart Oda",
        price: 3100,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "lara-aile",
        name: "Aile Odası",
        price: 4400,
        capacity: 4,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80&auto=format&fit=crop",
      },
    ],
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
    description:
      "Şehir merkezinde, eşsiz Boğaz manzarasına sahip Boğaziçi Palace Hotel; iş ve tatil amaçlı konaklamalarda mescidi ve helal mutfağıyla misafirlerine konfor sunar.",
    images: [
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80&auto=format&fit=crop",
    ],
    halalFeatures: ["halalFood", "prayerRoom"],
    rooms: [
      {
        id: "bogazici-standart",
        name: "Standart Oda",
        price: 2650,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "bogazici-manzarali",
        name: "Boğaz Manzaralı Suit",
        price: 3950,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80&auto=format&fit=crop",
      },
    ],
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
    description:
      "Kapadokya'nın eşsiz peribacaları arasında, otantik mağara mimarisiyle tasarlanmış butik bir otel. Alkolsüz konsepti ve mescidiyle huzurlu bir kaçamak sunar; sabahları sıcak hava balonu turlarına yürüme mesafesindedir.",
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570214476695-19bd467e6f7a?w=1200&q=80&auto=format&fit=crop",
    ],
    halalFeatures: ["noAlcohol", "halalFood", "prayerRoom"],
    rooms: [
      {
        id: "kapadokya-magara",
        name: "Mağara Oda",
        price: 3850,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "kapadokya-terasli",
        name: "Teraslı Suit",
        price: 5200,
        capacity: 3,
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80&auto=format&fit=crop",
      },
    ],
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
    description:
      "Ölüdeniz'in ünlü mavi lagününe kıyısı olan otel, kadınlara özel plaj saatleri ve alkolsüz restoranıyla tatilinizi huzurla geçirmenizi sağlar. Yamaç paraşütü inişleri otelin hemen önünde gerçekleşir.",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format&fit=crop",
    ],
    halalFeatures: ["separateBeach", "noAlcohol"],
    rooms: [
      {
        id: "oludeniz-standart",
        name: "Standart Oda",
        price: 3400,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "oludeniz-lagun",
        name: "Lagün Manzaralı Oda",
        price: 4650,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80&auto=format&fit=crop",
      },
    ],
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
    description:
      "Marmaris marinasına nazır, şehir hayatına yakın bir otel. Standart oda ve suit seçenekleriyle hem kısa şehir kaçamakları hem de aile tatilleri için uygundur.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&q=80&auto=format&fit=crop",
    ],
    halalFeatures: ["halalFood"],
    rooms: [
      {
        id: "marmaris-standart",
        name: "Standart Oda",
        price: 2950,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "marmaris-marina-suit",
        name: "Marina Manzaralı Suit",
        price: 3800,
        capacity: 3,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80&auto=format&fit=crop",
      },
    ],
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
    hotelId: "cennet-koy-resort",
  },
  {
    id: "mert-kaya",
    name: "Mert Kaya",
    location: "İzmir",
    avatar: "https://i.pravatar.cc/150?img=12",
    quote:
      "Kapadokya'daki mağara otel önerisi tam isabet oldu. Müşteri desteği de her sorumda çok hızlı döndü.",
    rating: 5,
    hotelId: "kapadokya-cave-suites",
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
