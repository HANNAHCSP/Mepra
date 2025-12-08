import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Accessibility Statement | Mepra",
  description: "Mepra's commitment to digital accessibility.",
};

export default function AccessibilityPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-light text-foreground mb-8">Accessibility Statement</h1>

        <div className="bg-white p-8 rounded-xl border border-border shadow-sm space-y-6 text-muted-foreground">
          <p className="text-lg">
            Mepra is committed to ensuring digital accessibility for people with disabilities. We
            are continually improving the user experience for everyone and applying the relevant
            accessibility standards.
          </p>

          <div>
            <h3 className="text-xl font-medium text-foreground mb-3">Conformance Status</h3>
            <p>
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and
              developers to improve accessibility for people with disabilities. It defines three
              levels of conformance: Level A, Level AA, and Level AAA. The Mepra website is
              partially conformant with WCAG 2.1 level AA.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-foreground mb-3">Features</h3>
            <ul className="space-y-2">
              {[
                "Keyboard navigable menu and interactive elements",
                "Alt text provided for all product images",
                "Sufficient color contrast for text readability",
                "Clear heading structures for screen readers",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-foreground mb-3">Feedback</h3>
            <p>
              We welcome your feedback on the accessibility of the Mepra store. Please let us know
              if you encounter accessibility barriers:
            </p>
            <p className="mt-2 font-medium text-foreground">
              E-mail:{" "}
              <a
                href="mailto:accessibility@mepra-store.com"
                className="text-secondary hover:underline"
              >
                accessibility@mepra-store.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
