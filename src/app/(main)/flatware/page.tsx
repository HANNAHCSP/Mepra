import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Luxury Flatware | Mepra",
  description: "Discover our collection of Italian flatware.",
};

const categories = [
  {
    name: "Cutlery Sets",
    desc: "Complete services for 6 or 12 people",
    img: "/placeholder.svg",
    link: "/products?q=set",
  },
  {
    name: "Spoons",
    desc: "Table, dessert, and coffee spoons",
    img: "/placeholder.svg",
    link: "/products?q=spoon",
  },
  {
    name: "Forks",
    desc: "Dinner, salad, and serving forks",
    img: "/placeholder.svg",
    link: "/products?q=fork",
  },
  {
    name: "Knives",
    desc: "Steak and table knives",
    img: "/placeholder.svg",
    link: "/products?q=knife",
  },
];

export default function FlatwarePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Category Hero */}
      <div className="relative bg-primary text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]"></div>
        <h1 className="relative text-4xl md:text-5xl font-light mb-4">Italian Flatware</h1>
        <p className="relative text-white/80 max-w-2xl mx-auto text-lg">
          Designed for those who appreciate the art of dining.
        </p>
      </div>

      {/* Sub-Category Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="group relative overflow-hidden rounded-xl bg-white border border-border shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[16/9] bg-muted relative">
                {/* Use generic placeholder for now since no product images */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-6xl font-serif italic">
                  {cat.name}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-medium text-foreground">{cat.name}</h3>
                    <p className="text-muted-foreground mt-1">{cat.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO / Content Block */}
        <div className="mt-20 prose prose-stone max-w-none text-center">
          <h2 className="font-light text-3xl">Why Choose Mepra Flatware?</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mt-4">
            Since 1947, Mepra has produced flatware in Lumezzane, Italy. Our flatware is made using
            the highest quality 18/10 stainless steel, ensuring it remains rust-free and keeps its
            shine for a lifetime. With over 100 designs available, we offer the widest range of
            Italian flatware in the world.
          </p>
        </div>
      </div>
    </div>
  );
}
