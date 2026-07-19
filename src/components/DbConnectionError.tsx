import trDictionary from "@/messages/tr.json";

// Admin liste sayfalarında MongoDB'ye bağlanılamadığında gösterilen ortak uyarı.
export default function DbConnectionError() {
  return (
    <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
      {trDictionary.admin.dbError.short}
    </p>
  );
}
