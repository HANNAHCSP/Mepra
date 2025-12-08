import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions | Mepra",
  description: "Find answers to common questions about Mepra products, shipping, and care.",
};

const faqs = [
  {
    category: "Product Care",
    questions: [
      {
        q: "Is Mepra flatware dishwasher safe?",
        a: "Yes, all Mepra stainless steel flatware is guaranteed to be dishwasher safe. We recommend avoiding harsh detergents containing lemon or chlorine.",
      },
      {
        q: "What is PVD coating?",
        a: "Physical Vapor Deposition (PVD) is a technique used to color stainless steel. It creates a molecular bond that is extremely durable, resistant to wear, and dishwasher safe.",
      },
      {
        q: "Do you offer a warranty?",
        a: "Yes, we offer a lifetime warranty against manufacturing defects on all our products.",
      },
    ],
  },
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "Where do you ship?",
        a: "We ship worldwide via trusted carriers. Shipping times vary by location but typically take 3-5 business days.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you will receive a confirmation email with a tracking number.",
      },
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery for unused items in their original packaging.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-4">
            <HelpCircle className="w-6 h-6 text-secondary" />
          </div>
          <h1 className="text-4xl font-light text-foreground">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-4">
            Can&apos;t find the answer you&apos;re looking for?{" "}
            <Link href="/contact" className="text-secondary hover:underline">
              Contact our support team
            </Link>
            .
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-medium text-foreground mb-6 border-b border-border pb-2">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.questions.map((item, qIdx) => (
                  <details
                    key={qIdx}
                    className="group bg-white border border-border rounded-lg [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-foreground font-medium transition-colors hover:bg-gray-50">
                      <span className="text-sm md:text-base">{item.q}</span>
                      <ChevronDown className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180 text-muted-foreground" />
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
