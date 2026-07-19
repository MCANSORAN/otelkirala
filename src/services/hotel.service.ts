import { randomUUID } from "crypto";
import { createHotel, updateHotel, deleteHotel } from "@/repositories/hotel.repository";
import { parseCommaSeparatedList } from "@/utils/csv";
import { HALAL_FEATURE_KEYS } from "@/constants/hotel";
import { runDbAction } from "@/services/db-result";
import trDictionary from "@/messages/tr.json";
import type { Hotel, Room, ServiceResult } from "@/types";

const v = trDictionary.admin.hotels.validation;

function parseRooms(raw: string): Room[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const rooms: Room[] = [];
  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) continue;
    const { id, name, price, capacity, image } = entry as Record<string, unknown>;
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const numericPrice = Number(price);
    const numericCapacity = Number(capacity);
    const trimmedImage = typeof image === "string" ? image.trim() : "";

    if (!trimmedName || !trimmedImage) continue;
    if (!Number.isFinite(numericPrice) || numericPrice < 0) continue;
    if (!Number.isFinite(numericCapacity) || numericCapacity < 1) continue;

    rooms.push({
      id: typeof id === "string" && id ? id : randomUUID(),
      name: trimmedName,
      price: numericPrice,
      capacity: numericCapacity,
      image: trimmedImage,
    });
  }
  return rooms;
}

function parseHotelInput(formData: FormData): Omit<Hotel, "id"> | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const price = Number(formData.get("price"));
  const rating = Number(formData.get("rating"));
  const reviewCount = Number(formData.get("reviewCount"));
  const tags = parseCommaSeparatedList(String(formData.get("tags") ?? ""));
  const description = String(formData.get("description") ?? "").trim();
  const images = parseCommaSeparatedList(String(formData.get("images") ?? ""));
  const halalFeatures = formData.getAll("halalFeatures").filter((key) => HALAL_FEATURE_KEYS.includes(key as (typeof HALAL_FEATURE_KEYS)[number])) as Hotel["halalFeatures"];
  const rooms = parseRooms(String(formData.get("roomsJson") ?? ""));

  if (!name || !location || !image) {
    return { error: v.required };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: v.price };
  }
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    return { error: v.rating };
  }
  if (!Number.isFinite(reviewCount) || reviewCount < 0) {
    return { error: v.reviewCount };
  }

  return { name, location, image, price, rating, reviewCount, tags, description, images, halalFeatures, rooms };
}

export async function createHotelFromForm(formData: FormData): Promise<ServiceResult> {
  const input = parseHotelInput(formData);
  if ("error" in input) return { ok: false, error: input.error };
  return runDbAction(() => createHotel(input));
}

export async function updateHotelFromForm(id: string, formData: FormData): Promise<ServiceResult> {
  const input = parseHotelInput(formData);
  if ("error" in input) return { ok: false, error: input.error };
  return runDbAction(() => updateHotel(id, input));
}

export async function deleteHotelById(id: string): Promise<ServiceResult> {
  return runDbAction(() => deleteHotel(id));
}
