import {
  createRequest,
  updateRequestStatus,
  deleteRequest,
} from "@/repositories/request.repository";
import { runDbAction } from "@/services/db-result";
import { MESSAGE_MAX_LENGTH } from "@/constants/reservation";
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

// Ad/soyad alanlarından rakamları ayıklar (istemci de aynısını yapar, bkz.
// ReservationForm stripDigits) — böylece isimlerde sayı tutulmaz.
const stripDigits = (value: string) => value.replace(/[0-9]/g, "").trim();

type ParsedRequest = Omit<ReservationRequest, "id" | "status" | "createdAt">;

function parseRequestInput(formData: FormData): ParsedRequest | { error: RequestErrorCode } {
  const hotelId = String(formData.get("hotelId") ?? "").trim();
  const hotelName = String(formData.get("hotelName") ?? "").trim();
  const roomId = String(formData.get("roomId") ?? "").trim() || undefined;
  const roomName = String(formData.get("roomName") ?? "").trim() || undefined;
  const firstName = stripDigits(String(formData.get("firstName") ?? ""));
  const lastName = stripDigits(String(formData.get("lastName") ?? ""));
  const fullName = `${firstName} ${lastName}`.trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || undefined;
  const checkIn = String(formData.get("checkIn") ?? "").trim() || undefined;
  const checkOut = String(formData.get("checkOut") ?? "").trim() || undefined;
  // Not alanı en fazla MESSAGE_MAX_LENGTH karakter (istemcideki maxLength ile eş).
  const message = String(formData.get("message") ?? "").trim().slice(0, MESSAGE_MAX_LENGTH) || undefined;
  const guests = Number(formData.get("guests"));
  const childrenRaw = Number(formData.get("children"));
  // Çocuk sayısı adım butonlarıyla girilir; yine de sunucuda [0, 10] aralığına sıkıştırılır.
  const children = Number.isFinite(childrenRaw) ? Math.min(10, Math.max(0, Math.trunc(childrenRaw))) : 0;
  // Kapasiteye göre gruplanmış oda sayısı ve gecelik toplam fiyat istemcide hesaplanır;
  // burada makul aralığa sıkıştırılır (roomCount ≥ 1, totalPrice yalnızca pozitifse tutulur).
  const roomCountRaw = Number(formData.get("roomCount"));
  const roomCount = Number.isFinite(roomCountRaw) ? Math.min(30, Math.max(1, Math.trunc(roomCountRaw))) : 1;
  const totalPriceRaw = Number(formData.get("totalPrice"));
  const totalPrice = Number.isFinite(totalPriceRaw) && totalPriceRaw > 0 ? Math.trunc(totalPriceRaw) : undefined;

  if (!hotelId || !firstName || !lastName || !phone) {
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
    children,
    message,
    roomCount,
    totalPrice,
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
