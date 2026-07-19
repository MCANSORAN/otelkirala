import { HALAL_FEATURE_ICONS } from "@/constants/hotel";
import type { Dictionary } from "@/messages/dictionaries";
import type { HalalFeatureKey } from "@/types";

export default function HalalFeatures({
  features,
  dict,
}: {
  features: HalalFeatureKey[];
  dict: Dictionary["hotelDetail"];
}) {
  if (features.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{dict.halalFeaturesTitle}</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {features.map((key) => (
          <div
            key={key}
            className="flex items-center gap-3 rounded-xl border border-gold-100 bg-brand-50/60 px-4 py-3 text-sm font-medium text-brand-900 dark:border-white/10 dark:bg-brand-950/30 dark:text-brand-300"
          >
            <span className="text-xl">{HALAL_FEATURE_ICONS[key]}</span>
            {dict.halalFeatures[key]}
          </div>
        ))}
      </div>
    </section>
  );
}
