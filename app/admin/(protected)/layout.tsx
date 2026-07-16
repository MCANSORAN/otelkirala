import Link from "next/link";
import { verifySession } from "@/lib/session";
import { logout } from "../actions";

const navLinks = [
  { href: "/admin", label: "Panel", icon: "📊" },
  { href: "/admin/hotels", label: "Oteller", icon: "🏨" },
  { href: "/admin/destinations", label: "Bölgeler", icon: "📍" },
  { href: "/admin/testimonials", label: "Yorumlar", icon: "💬" },
];

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await verifySession();

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <aside className="hidden w-60 shrink-0 border-r border-black/5 bg-white p-5 sm:flex sm:flex-col dark:border-white/10 dark:bg-neutral-900">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-sky-700 dark:text-sky-400">
          <span className="text-2xl">🏨</span>
          OtelKirala
        </Link>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Yönetici Paneli</p>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            Çıkış Yap
          </button>
        </form>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4 sm:hidden dark:border-white/10 dark:bg-neutral-900">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-sky-700 dark:text-sky-400">
            <span className="text-xl">🏨</span>
            OtelKirala Admin
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm font-medium text-neutral-500 hover:text-red-600">
              Çıkış
            </button>
          </form>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-black/5 bg-white px-4 py-2 sm:hidden dark:border-white/10 dark:bg-neutral-900">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-6 py-8 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
