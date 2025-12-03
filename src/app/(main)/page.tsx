"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Sparkles,
  TrendingUp,
  Mail,
  CheckCircle,
  ShieldCheck,
  Globe,
  Star,
} from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-secondary/20">
      {/* --- HERO SECTION --- 
          Best of: Code 1's layout/gradients + Code 1's overlapping images */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-foreground tracking-wide">
                Italian Craftsmanship Since 1947
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-light text-foreground leading-tight">
              The <span className="italic font-serif text-secondary">Luxury</span> Art of
              <br />
              <span className="font-semibold text-primary">Fine Living</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Mepra was created in 1947, but the entrepreneurial story of the Prandelli family
              starts many years earlier. We craft pieces that transform everyday moments into
              extraordinary experiences.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Explore Collection
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-foreground px-8 py-4 rounded-lg font-medium border-2 border-border transition-all hover:-translate-y-1"
              >
                Our Story
              </Link>
            </div>

            {/* Trust Indicators (From Code 1) */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-secondary" />
                  <span className="text-2xl font-bold text-foreground">75+</span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">Years of Excellence</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  <span className="text-2xl font-bold text-foreground">10k+</span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  <span className="text-2xl font-bold text-foreground">100%</span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">Handcrafted</p>
              </div>
            </div>
          </div>

          {/* Images Composition (From Code 1 - it's more dynamic) */}
          <div className="relative h-[600px] lg:h-[700px] hidden lg:block">
            {/* Main Large Image */}
            <div className="absolute top-0 right-0 w-[75%] h-[70%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-700 z-10">
              <Image
                src="/craftsman.png"
                alt="Mepra Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Smaller Accent Image */}
            <div className="absolute bottom-10 left-0 w-[55%] h-[50%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-700 z-20">
              <Image
                src="/vintage.png"
                alt="Mepra Heritage"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>

            {/* Blur Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* --- FEATURED COLLECTIONS --- 
          Best of: Code 2's clean cards + Code 1's hover scale */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <p className="text-secondary font-semibold tracking-wider uppercase text-sm">
              Explore Our Collections
            </p>
            <h2 className="text-4xl lg:text-5xl font-light text-foreground">Timeless Elegance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our curated selection of Italian-made luxury pieces, designed to last a
              lifetime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Flatware",
                image: "/placeholder.svg",
                items: "24 Collections",
                link: "/flatware",
              },
              {
                title: "Cookware",
                image: "/placeholder.svg",
                items: "18 Collections",
                link: "/cookware",
              },
              {
                title: "Serveware",
                image: "/placeholder.svg",
                items: "32 Collections",
                link: "/serveware",
              },
            ].map((category, idx) => (
              <Link
                key={idx}
                href={category.link}
                className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 z-10" />

                {/* Image with Scale Effect */}
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                  <p className="text-white/80 text-sm font-medium mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {category.items}
                  </p>
                  <h3 className="text-3xl font-light text-white mb-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                    {category.title}
                  </h3>
                  <div className="inline-flex items-center text-white font-medium border-b border-white/30 pb-1 w-fit">
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- QUALITY PROMISE ---
          Best of: Code 2's specific features section (adds value) */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              {
                icon: Star,
                title: "Italian Craftsmanship",
                description:
                  "Every piece is meticulously crafted in Italy with generations of expertise since 1947.",
              },
              {
                icon: ShieldCheck,
                title: "Lifetime Warranty",
                description:
                  "We stand behind our quality with comprehensive lifetime coverage on all manufacturing.",
              },
              {
                icon: Globe,
                title: "Worldwide Delivery",
                description:
                  "Secure, tracked, and insured shipping to your door, anywhere in the world.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="w-20 h-20 mx-auto bg-white border border-border rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <feature.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-medium text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER ---
          Best of: Code 1's visual gradient + Code 2's functional logic */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-light mb-6">Join Our Community</h2>
          <p className="text-primary-foreground/80 mb-10 text-lg max-w-2xl mx-auto">
            Subscribe to receive exclusive offers, new product launches, and Italian craftsmanship
            stories directly to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto relative">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || subscribed}
                  className="w-full pl-12 pr-6 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all disabled:opacity-80"
                />
              </div>
              <button
                type="submit"
                disabled={loading || subscribed}
                className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-80 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : subscribed ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" /> Done
                  </span>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>

            <p className="mt-4 text-sm text-primary-foreground/60 flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Your privacy matters. We&apos;ll never share your email.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
