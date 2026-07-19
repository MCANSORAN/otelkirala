import Link from "next/link";
import type { Dictionary } from "@/messages/dictionaries";
import type { Locale } from "@/constants/locales";

export default function Footer({ dict, lang }: { dict: Dictionary["footer"]; lang: Locale }) {
  return (
    <footer className="border-t border-gold-500/10 bg-brand-950 text-brand-100/70">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-xl font-bold text-gold-400">
            <span className="text-2xl">🏨</span> OtelKirala
          </p>
          <p className="mt-3 max-w-xs text-sm text-brand-100/60">{dict.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{dict.exploreTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href={`/${lang}/hotels`} className="hover:text-gold-400">{dict.exploreLinks.hotels}</Link></li>
            <li><Link href={`/${lang}/destinations`} className="hover:text-gold-400">{dict.exploreLinks.destinations}</Link></li>
            <li><Link href={`/${lang}/reviews`} className="hover:text-gold-400">{dict.exploreLinks.reviews}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{dict.companyTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#" className="hover:text-gold-400">{dict.companyLinks.about}</a></li>
            <li><a href="#" className="hover:text-gold-400">{dict.companyLinks.careers}</a></li>
            <li><a href="#" className="hover:text-gold-400">{dict.companyLinks.privacy}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            <Link href={`/${lang}/contact`} className="hover:text-gold-400">
              {dict.contactTitle}
            </Link>
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{dict.email}</li>
            <li>{dict.phone}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-500/10 px-6 py-6 text-center text-xs text-brand-100/50">
        © {new Date().getFullYear().toString()} OtelKirala. {dict.rightsReserved}
      </div>
    </footer>
  );
}
