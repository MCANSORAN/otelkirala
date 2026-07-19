import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/repositories/testimonial.repository";
import { runDbAction } from "@/services/db-result";
import trDictionary from "@/messages/tr.json";
import type { Testimonial, ServiceResult } from "@/types";

const v = trDictionary.admin.testimonials.validation;

function parseTestimonialInput(formData: FormData): Omit<Testimonial, "id"> | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const avatar = String(formData.get("avatar") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const hotelIdRaw = String(formData.get("hotelId") ?? "").trim();
  const hotelId = hotelIdRaw || undefined;

  if (!name || !location || !avatar || !quote) {
    return { error: v.required };
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { error: v.rating };
  }

  return { name, location, avatar, quote, rating, hotelId };
}

export async function createTestimonialFromForm(formData: FormData): Promise<ServiceResult> {
  const input = parseTestimonialInput(formData);
  if ("error" in input) return { ok: false, error: input.error };
  return runDbAction(() => createTestimonial(input));
}

export async function updateTestimonialFromForm(
  id: string,
  formData: FormData
): Promise<ServiceResult> {
  const input = parseTestimonialInput(formData);
  if ("error" in input) return { ok: false, error: input.error };
  return runDbAction(() => updateTestimonial(id, input));
}

export async function deleteTestimonialById(id: string): Promise<ServiceResult> {
  return runDbAction(() => deleteTestimonial(id));
}
