import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Luxury Serveware | Mepra",
  description: "Elegant Italian serveware for the perfect table setting.",
};

const categories = [
  { name: "Serving Trays", desc: "Elegant presentation", link: "/products?q=tray" },
  { name: "Bowls & Baskets", desc: "For bread and fruit", link: "/products?q=bowl" },
  { name: "Coffee & Tea", desc: "Italian coffee service", link: "/products?q=coffee" },
  { name: "Barware", desc: "Coolers and shakers", link: "/products?q=bar" },
];

export default function ServewarePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative bg-[#5E503F] text-white py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-light mb-4">Art of Serving</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Details that make the difference.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={cat.link}
              className="group flex flex-col bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square bg-neutral-50 flex items-center justify-center relative overflow-hidden">
                 <div className="text-neutral-200 text-8xl font-serif italic absolute -right-4 -bottom-8 group-hover:-translate-y-2 transition-transform">
                  {idx + 1}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{cat.desc}</p>
                </div>
                <div className="mt-4 text-sm font-medium text-secondary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}