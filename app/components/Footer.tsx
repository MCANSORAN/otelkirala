import type { Dictionary } from "@/lib/dictionaries";

export default function Footer({ dict }: { dict: Dictionary["footer"] }) {
  return (
    <footer id="iletisim" className="border-t border-black/5 bg-neutral-950 text-neutral-300 dark:border-white/10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-2xl">🏨</span> OtelKirala
          </p>
          <p className="mt-3 max-w-xs text-sm text-neutral-400">{dict.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{dict.exploreTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#oteller" className="hover:text-white">{dict.exploreLinks.hotels}</a></li>
            <li><a href="#bolgeler" className="hover:text-white">{dict.exploreLinks.destinations}</a></li>
            <li><a href="#yorumlar" className="hover:text-white">{dict.exploreLinks.reviews}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{dict.companyTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">{dict.companyLinks.about}</a></li>
            <li><a href="#" className="hover:text-white">{dict.companyLinks.careers}</a></li>
            <li><a href="#" className="hover:text-white">{dict.companyLinks.privacy}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{dict.contactTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>destek@otelkirala.com</li>
            <li>0850 000 00 00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear().toString()} OtelKirala. {dict.rightsReserved}
      </div>
    </footer>
  );
}
