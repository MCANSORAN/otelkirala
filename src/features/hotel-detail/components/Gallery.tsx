"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-2xl sm:h-[28rem]">
        <Image
          src={images[selectedIndex]}
          alt={alt}
          fill
          preload
          sizes="(max-width: 768px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                index === selectedIndex ? "ring-gold-500" : "ring-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <Image src={image} alt={`${alt} ${index + 1}`} fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
