import { DB_ERROR_MESSAGE } from "@/constants/errors";
import type { ServiceResult } from "@/types";

// Bir repository yazma çağrısını çalıştırır ve DB bağlantı hatasını ortak
// ServiceResult biçimine çevirir. Servis katmanındaki tekrarlanan try/catch'i tek yere toplar.
export async function runDbAction(action: () => Promise<unknown>): Promise<ServiceResult> {
  try {
    await action();
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: DB_ERROR_MESSAGE };
  }
}
