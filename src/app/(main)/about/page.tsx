import Image from "next/image";
import Link from "next/link";
import { Award, Users, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Our Story | Mepra - The Luxury Art",
  description: "The story of the Prandelli family and Mepra, crafting Italian luxury since 1947.",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/craftsman.png"
            alt="Mepra Craftsmanship"
            fill
            className="object-cover opacity-90 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto text-white space-y-6">
          <p className="text-secondary font-medium tracking-[0.2em] uppercase text-sm">
            Since 1947
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight">The Luxury Art</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Mepra was created in 1947, but the entrepreneurial story of the Prandelli family starts
            many years earlier.
          </p>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-light text-foreground">A Family History</h2>
            <div className="w-20 h-1 bg-secondary/30" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The name Mepra is an acronym for Metallurgica Prandelli. It is a story of passion
                for tradition, culture, and Italian style that has been handed down for generations.
              </p>
              <p>
                Today, Mepra is a company with a worldwide presence, exporting its products and
                designs to every country in the world. Mepra continuously innovates its processes
                and products, championing the &quot;Made in Italy&quot; standard.
              </p>
              <p>
                We bring three generations of Italian tradition, design, and lifestyle to your
                table.
              </p>
            </div>
            <div className="pt-4">
              <Image
                src="/vintage.png"
                alt="The Prandelli Family History"
                width={500}
                height={350}
                className="rounded-lg shadow-xl border-4 border-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm">
              <Award className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">Award Winning Design</h3>
              <p className="text-muted-foreground text-sm">
                Collaborations with prestigious designers like Pininfarina have led to numerous
                awards for innovation and style.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm">
              <Globe className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">Global Presence</h3>
              <p className="text-muted-foreground text-sm">
                Found in the finest hotels, restaurants, and homes across more than 50 countries
                worldwide.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm">
              <Users className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">Family Owned</h3>
              <p className="text-muted-foreground text-sm">
                Still owned and operated by the Prandelli family, ensuring personal commitment to
                quality in every piece.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/5 py-20 border-y border-border">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-light text-foreground mb-6">Experience the Quality</h2>
          <p className="text-muted-foreground mb-8">
            Discover our collections and bring a piece of Italian history to your home.
          </p>
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
            <Link href="/products">
              View Collections <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
