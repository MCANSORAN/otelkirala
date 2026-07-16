import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Yönetici Girişi | OtelKirala",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-1px)] items-center justify-center bg-neutral-50 px-6 py-16 dark:bg-neutral-950">
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <div className="mb-6 text-center">
          <span className="text-3xl">🏨</span>
          <h1 className="mt-2 text-xl font-bold text-neutral-900 dark:text-white">Yönetici Paneli</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Devam etmek için giriş yapın.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
