import type { Hotel } from "@/types";

// Türkçe karakterleri ve büyük/küçük harf farkını yok sayarak karşılaştırma
// yapabilmek için metni sadeleştirir. Örn: "İSTANBUL", "istanbul", "Istanbul" eşleşir.
function normalizeText(value: string): string {
  return value
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .replace(/Ş/g, "s")
    .replace(/ş/g, "s")
    .replace(/Ç/g, "c")
    .replace(/ç/g, "c")
    .replace(/Ğ/g, "g")
    .replace(/ğ/g, "g")
    .replace(/Ö/g, "o")
    .replace(/ö/g, "o")
    .replace(/Ü/g, "u")
    .replace(/ü/g, "u")
    .toLowerCase();
}

// Otelleri isim, konum ve etiketlerine göre filtreler. Sorgu boşluklarla
// bölünür ve her terimin eşleşmesi aranır. Sorgu boşsa tüm oteller döner.
export function searchHotels(hotels: Hotel[], query: string): Hotel[] {
  const normalizedQuery = normalizeText(query.trim());
  if (!normalizedQuery) return hotels;

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  return hotels.filter((hotel) => {
    const haystack = normalizeText([hotel.name, hotel.location, ...hotel.tags].join(" "));
    return terms.every((term) => haystack.includes(term));
  });
}
