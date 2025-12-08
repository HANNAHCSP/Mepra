"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  // Use the first image as default, or a placeholder if empty
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Ensure we always have at least one image to show
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];
  const selectedImage = displayImages[selectedIndex];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
              selectedIndex === index
                ? "border-primary ring-2 ring-primary/20 ring-offset-2"
                : "border-transparent hover:border-border"
            )}
            aria-label={`View image ${index + 1} of ${name}`}
          >
            <Image
              src={image}
              alt={`${name} view ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom */}
      <div className="relative flex-1 aspect-square bg-white rounded-2xl overflow-hidden border border-border group cursor-zoom-in">
        {/* We use two images: one for display, one for the zoom effect */}
        <div className="relative w-full h-full">
          <Image
            src={selectedImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay to indicate interactivity */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-300" />
        </div>
      </div>
    </div>
  );
}
