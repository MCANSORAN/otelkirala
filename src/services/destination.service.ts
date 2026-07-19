import {
  createDestination,
  updateDestination,
  deleteDestination,
} from "@/repositories/destination.repository";
import { runDbAction } from "@/services/db-result";
import trDictionary from "@/messages/tr.json";
import type { Destination, ServiceResult } from "@/types";

const v = trDictionary.admin.destinations.validation;

function parseDestinationInput(formData: FormData): Omit<Destination, "id"> | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const hotelCount = Number(formData.get("hotelCount"));

  if (!name || !image) {
    return { error: v.required };
  }
  if (!Number.isFinite(hotelCount) || hotelCount < 0) {
    return { error: v.hotelCount };
  }

  return { name, image, hotelCount };
}

export async function createDestinationFromForm(formData: FormData): Promise<ServiceResult> {
  const input = parseDestinationInput(formData);
  if ("error" in input) return { ok: false, error: input.error };
  return runDbAction(() => createDestination(input));
}

export async function updateDestinationFromForm(
  id: string,
  formData: FormData
): Promise<ServiceResult> {
  const input = parseDestinationInput(formData);
  if ("error" in input) return { ok: false, error: input.error };
  return runDbAction(() => updateDestination(id, input));
}

export async function deleteDestinationById(id: string): Promise<ServiceResult> {
  return runDbAction(() => deleteDestination(id));
}
