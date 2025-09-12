"use client";

import { useState } from "react";
import Image from "next/image";

export default function Page() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section (centered vertically + horizontally) */}
      <section className="max-w-7xl mx-auto px-6 py-16 min-h-[70vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center justify-items-center w-full">
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-light text-gray-900 italic">Mepra since 1947, Italy</h1>
            <p className="text-gray-700 leading-relaxed text-lg">
              Mepra was created in 1947, but the entrepreneurial story of the Prandelli family
              starts many years earlier.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In 1901, brothers Bortolo, Francesco and Giovanbattista create the first family
              business, Prandelli, in the Lumezzane Valley by the banks of River Gobbia to make use
              of its water kinetic energy that would allow machinery to operate.
            </p>
            <button className="border border-gray-900 px-6 py-3 text-sm tracking-wider hover:bg-gray-900 hover:text-white transition-colors">
              READ MORE →
            </button>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4 justify-items-center w-full">
            
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src="/craftsman.png"
                alt="Mepra Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                onError={(e) =>
                  console.log("Image failed to load:", (e.target as HTMLImageElement).src)
                }
                priority={true}
              />
            </div>
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src="/vintage.png"
                alt="Mepra Heritage"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                onError={(e) =>
                  console.log("Image failed to load:", (e.target as HTMLImageElement).src)
                }
              />
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
