"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, deleteSession, verifyCredentials, verifySession } from "@/lib/session";
import { createHotel, updateHotel, deleteHotel } from "@/lib/hotels";
import { createDestination, updateDestination, deleteDestination } from "@/lib/destinations";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/testimonials";
import { seedDatabase } from "@/lib/seed";
import type { Destination, Hotel, Testimonial } from "@/lib/types";

const DB_ERROR_MESSAGE =
  "Veritabanına bağlanılamadı. MONGODB_URI ayarınızı kontrol edip tekrar deneyin.";

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(username, password)) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}

export async function seedAction(): Promise<void> {
  await verifySession();
  try {
    await seedDatabase();
  } catch {
    redirect(`/admin?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  redirect("/admin?seeded=1");
}

// ---------- Oteller ----------

function parseHotelInput(formData: FormData): Omit<Hotel, "id"> | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const price = Number(formData.get("price"));
  const rating = Number(formData.get("rating"));
  const reviewCount = Number(formData.get("reviewCount"));
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!name || !location || !image) {
    return { error: "Otel adı, konum ve görsel adresi zorunludur." };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Geçerli bir gecelik fiyat girin." };
  }
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    return { error: "Puan 0 ile 5 arasında olmalıdır." };
  }
  if (!Number.isFinite(reviewCount) || reviewCount < 0) {
    return { error: "Geçerli bir değerlendirme sayısı girin." };
  }

  return { name, location, image, price, rating, reviewCount, tags };
}

export async function createHotelAction(formData: FormData): Promise<void> {
  await verifySession();
  const input = parseHotelInput(formData);
  if ("error" in input) {
    redirect(`/admin/hotels/new?error=${encodeURIComponent(input.error)}`);
  }

  try {
    await createHotel(input);
  } catch {
    redirect(`/admin/hotels/new?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/hotels");
  revalidatePath("/");
  redirect("/admin/hotels");
}

export async function updateHotelAction(id: string, formData: FormData): Promise<void> {
  await verifySession();
  const input = parseHotelInput(formData);
  if ("error" in input) {
    redirect(`/admin/hotels/${id}?error=${encodeURIComponent(input.error)}`);
  }

  try {
    await updateHotel(id, input);
  } catch {
    redirect(`/admin/hotels/${id}?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/hotels");
  revalidatePath("/");
  redirect("/admin/hotels");
}

export async function deleteHotelAction(formData: FormData): Promise<void> {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  if (id) {
    try {
      await deleteHotel(id);
      revalidatePath("/admin/hotels");
      revalidatePath("/");
    } catch {
      redirect(`/admin/hotels?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
    }
  }
  redirect("/admin/hotels");
}

// ---------- Bölgeler ----------

function parseDestinationInput(formData: FormData): Omit<Destination, "id"> | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const hotelCount = Number(formData.get("hotelCount"));

  if (!name || !image) {
    return { error: "Bölge adı ve görsel adresi zorunludur." };
  }
  if (!Number.isFinite(hotelCount) || hotelCount < 0) {
    return { error: "Geçerli bir otel sayısı girin." };
  }

  return { name, image, hotelCount };
}

export async function createDestinationAction(formData: FormData): Promise<void> {
  await verifySession();
  const input = parseDestinationInput(formData);
  if ("error" in input) {
    redirect(`/admin/destinations/new?error=${encodeURIComponent(input.error)}`);
  }

  try {
    await createDestination(input);
  } catch {
    redirect(`/admin/destinations/new?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/");
  redirect("/admin/destinations");
}

export async function updateDestinationAction(id: string, formData: FormData): Promise<void> {
  await verifySession();
  const input = parseDestinationInput(formData);
  if ("error" in input) {
    redirect(`/admin/destinations/${id}?error=${encodeURIComponent(input.error)}`);
  }

  try {
    await updateDestination(id, input);
  } catch {
    redirect(`/admin/destinations/${id}?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/");
  redirect("/admin/destinations");
}

export async function deleteDestinationAction(formData: FormData): Promise<void> {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  if (id) {
    try {
      await deleteDestination(id);
      revalidatePath("/admin/destinations");
      revalidatePath("/");
    } catch {
      redirect(`/admin/destinations?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
    }
  }
  redirect("/admin/destinations");
}

// ---------- Yorumlar ----------

function parseTestimonialInput(formData: FormData): Omit<Testimonial, "id"> | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const avatar = String(formData.get("avatar") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const rating = Number(formData.get("rating"));

  if (!name || !location || !avatar || !quote) {
    return { error: "Ad, konum, avatar adresi ve yorum metni zorunludur." };
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { error: "Puan 1 ile 5 arasında olmalıdır." };
  }

  return { name, location, avatar, quote, rating };
}

export async function createTestimonialAction(formData: FormData): Promise<void> {
  await verifySession();
  const input = parseTestimonialInput(formData);
  if ("error" in input) {
    redirect(`/admin/testimonials/new?error=${encodeURIComponent(input.error)}`);
  }

  try {
    await createTestimonial(input);
  } catch {
    redirect(`/admin/testimonials/new?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(id: string, formData: FormData): Promise<void> {
  await verifySession();
  const input = parseTestimonialInput(formData);
  if ("error" in input) {
    redirect(`/admin/testimonials/${id}?error=${encodeURIComponent(input.error)}`);
  }

  try {
    await updateTestimonial(id, input);
  } catch {
    redirect(`/admin/testimonials/${id}?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  if (id) {
    try {
      await deleteTestimonial(id);
      revalidatePath("/admin/testimonials");
      revalidatePath("/");
    } catch {
      redirect(`/admin/testimonials?error=${encodeURIComponent(DB_ERROR_MESSAGE)}`);
    }
  }
  redirect("/admin/testimonials");
}
