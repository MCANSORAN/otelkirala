"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, deleteSession, verifyCredentials, verifySession } from "@/services/auth.service";
import { seedDatabase } from "@/services/seed.service";
import { createHotelFromForm, updateHotelFromForm, deleteHotelById } from "@/services/hotel.service";
import {
  createDestinationFromForm,
  updateDestinationFromForm,
  deleteDestinationById,
} from "@/services/destination.service";
import {
  createTestimonialFromForm,
  updateTestimonialFromForm,
  deleteTestimonialById,
} from "@/services/testimonial.service";
import { updateRequestStatusById, deleteRequestById } from "@/services/request.service";
import trDictionary from "@/messages/tr.json";
import type { ReservationStatus, ServiceResult } from "@/types";

// Oluştur/güncelle akışı: doğrula → çalıştır → hata varsa forma geri dön, yoksa
// listeyi ve ana sayfayı tazeleyip listeye dön. redirect() bir istisna fırlattığı
// için tazeleme yalnızca başarı durumunda çalışır.
// tags: genel sayfaların unstable_cache girdilerini (bkz. repositories) tazelemek için
// revalidateTag'e verilir; böylece admin değişikliği önbelleğe rağmen anında yansır.
async function runMutation(
  errorPath: string,
  listPath: string,
  tags: readonly string[],
  mutate: () => Promise<ServiceResult>
): Promise<void> {
  await verifySession();
  const result = await mutate();
  if (!result.ok) {
    redirect(`${errorPath}?error=${encodeURIComponent(result.error)}`);
  }
  revalidatePath(listPath);
  revalidatePath("/");
  // expire: 0 → etiketli önbellek anında geçersiz; admin değişikliği ilk görüntülemede yansır.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  redirect(listPath);
}

async function runDelete(
  listPath: string,
  tags: readonly string[],
  formData: FormData,
  remove: (id: string) => Promise<ServiceResult>
): Promise<void> {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const result = await remove(id);
    if (!result.ok) {
      redirect(`${listPath}?error=${encodeURIComponent(result.error)}`);
    }
    revalidatePath(listPath);
    revalidatePath("/");
    for (const tag of tags) revalidateTag(tag, { expire: 0 });
  }
  redirect(listPath);
}

// ---------- Oturum ----------

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(username, password)) {
    return { error: trDictionary.admin.login.error };
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
  const result = await seedDatabase();
  if (!result.ok) {
    redirect(`/admin?error=${encodeURIComponent(result.error)}`);
  }

  revalidatePath("/admin", "layout");
  revalidatePath("/");
  revalidateTag("hotels", { expire: 0 });
  revalidateTag("destinations", { expire: 0 });
  revalidateTag("testimonials", { expire: 0 });
  redirect("/admin?seeded=1");
}

// ---------- Oteller ----------

export async function createHotelAction(formData: FormData): Promise<void> {
  await runMutation("/admin/hotels/new", "/admin/hotels", ["hotels"], () => createHotelFromForm(formData));
}

export async function updateHotelAction(id: string, formData: FormData): Promise<void> {
  await runMutation(`/admin/hotels/${id}`, "/admin/hotels", ["hotels"], () =>
    updateHotelFromForm(id, formData)
  );
}

export async function deleteHotelAction(formData: FormData): Promise<void> {
  await runDelete("/admin/hotels", ["hotels"], formData, deleteHotelById);
}

// ---------- Bölgeler ----------

export async function createDestinationAction(formData: FormData): Promise<void> {
  await runMutation("/admin/destinations/new", "/admin/destinations", ["destinations"], () =>
    createDestinationFromForm(formData)
  );
}

export async function updateDestinationAction(id: string, formData: FormData): Promise<void> {
  await runMutation(`/admin/destinations/${id}`, "/admin/destinations", ["destinations"], () =>
    updateDestinationFromForm(id, formData)
  );
}

export async function deleteDestinationAction(formData: FormData): Promise<void> {
  await runDelete("/admin/destinations", ["destinations"], formData, deleteDestinationById);
}

// ---------- Yorumlar ----------

export async function createTestimonialAction(formData: FormData): Promise<void> {
  await runMutation("/admin/testimonials/new", "/admin/testimonials", ["testimonials"], () =>
    createTestimonialFromForm(formData)
  );
}

export async function updateTestimonialAction(id: string, formData: FormData): Promise<void> {
  await runMutation(`/admin/testimonials/${id}`, "/admin/testimonials", ["testimonials"], () =>
    updateTestimonialFromForm(id, formData)
  );
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  await runDelete("/admin/testimonials", ["testimonials"], formData, deleteTestimonialById);
}

// ---------- Talepler ----------

const REQUEST_STATUSES: ReservationStatus[] = ["new", "contacted", "closed"];

export async function updateRequestStatusAction(id: string, formData: FormData): Promise<void> {
  await verifySession();
  const status = String(formData.get("status") ?? "");
  if ((REQUEST_STATUSES as string[]).includes(status)) {
    const result = await updateRequestStatusById(id, status as ReservationStatus);
    if (!result.ok) {
      redirect(`/admin/requests?error=${encodeURIComponent(result.error)}`);
    }
    revalidatePath("/admin/requests");
  }
  redirect("/admin/requests");
}

export async function deleteRequestAction(formData: FormData): Promise<void> {
  // Talepler yalnızca admin panelinde görünür; genel önbellek etiketi yok.
  await runDelete("/admin/requests", [], formData, deleteRequestById);
}
