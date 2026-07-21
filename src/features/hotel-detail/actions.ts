"use server";

import { revalidatePath } from "next/cache";
import { createRequestFromForm, type RequestErrorCode } from "@/services/request.service";
import { getDictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";

export type RequestFormState = { ok?: boolean; error?: string } | undefined;

// Otel detay sayfasındaki rezervasyon talebi formunu işler. Doğrulama/DB hataları
// aktif dile göre çevrilir (servis KOD döner). Başarıda admin listesi tazelenir.
export async function submitReservationRequest(
  lang: Locale,
  _prevState: RequestFormState,
  formData: FormData
): Promise<RequestFormState> {
  const result = await createRequestFromForm(formData);

  if (!result.ok) {
    const errors = getDictionary(lang).hotelDetail.request.errors;
    return { error: errors[result.error as RequestErrorCode] };
  }

  revalidatePath("/admin/requests");
  return { ok: true };
}
