import {
  createRequest,
  updateRequestStatus,
  deleteRequest,
} from "@/repositories/request.repository";
import { runDbAction } from "@/services/db-result";
import type { ReservationRequest, ReservationStatus, ServiceResult } from "@/types";

// Public (i18n'li) form doğrulama hataları KOD olarak döner; çağıran server action
// aktif dile göre çevirir (bkz. features/auth/actions.ts deseni).
export type RequestErrorCode =
  | "requiredFields"
  | "invalidEmail"
  | "invalidGuests"
  | "invalidDateRange"
  | "dbError";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ParsedRequest = Omit<ReservationRequest, "id" | "status" | "createdAt">;

function parseRequestInput(formData: FormData): ParsedRequest | { error: RequestErrorCode } {
  const hotelId = String(formData.get("hotelId") ?? "").trim();
  const hotelName = String(formData.get("hotelName") ?? "").trim();
  const roomId = String(formData.get("roomId") ?? "").trim() || undefined;
  const roomName = String(formData.get("roomName") ?? "").trim() || undefined;
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || undefined;
  const checkIn = String(formData.get("checkIn") ?? "").trim() || undefined;
  const checkOut = String(formData.get("checkOut") ?? "").trim() || undefined;
  const message = String(formData.get("message") ?? "").trim() || undefined;
  const guests = Number(formData.get("guests"));

  if (!hotelId || !fullName || !phone) {
    return { error: "requiredFields" };
  }
  if (email && !EMAIL_RE.test(email)) {
    return { error: "invalidEmail" };
  }
  if (!Number.isFinite(guests) || guests < 1 || guests > 30) {
    return { error: "invalidGuests" };
  }
  if (checkIn && checkOut && checkOut <= checkIn) {
    return { error: "invalidDateRange" };
  }

  return {
    hotelId,
    hotelName,
    roomId,
    roomName,
    fullName,
    phone,
    email,
    checkIn,
    checkOut,
    guests,
    message,
  };
}

// Public: talebi doğrula ve kaydet. Hata durumunda KOD döner (dbError dahil).
export async function createRequestFromForm(formData: FormData): Promise<ServiceResult> {
  const input = parseRequestInput(formData);
  if ("error" in input) return { ok: false, error: input.error };

  try {
    await createRequest(input);
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "dbError" };
  }
}

// Admin (tr-only): durum güncelle / sil. runDbAction tr mesajı döndürür.
export async function updateRequestStatusById(
  id: string,
  status: ReservationStatus
): Promise<ServiceResult> {
  return runDbAction(() => updateRequestStatus(id, status));
}

export async function deleteRequestById(id: string): Promise<ServiceResult> {
  return runDbAction(() => deleteRequest(id));
}
