import { Shield, Lock, Eye } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Mepra",
  description: "How Mepra collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-4">
            <Shield className="w-6 h-6 text-secondary" />
          </div>
          <h1 className="text-4xl font-light text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mt-4">Last updated: December 6, 2025</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Table of Contents / Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 px-2">
                Contents
              </p>
              {["Collection", "Usage", "Sharing", "Security", "Your Rights"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-md transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-xl border border-border shadow-sm">
            <div className="prose prose-stone max-w-none text-muted-foreground">
              <p className="lead">
                This Privacy Policy describes how Mepra (the &quot;Site&quot;, &quot;we&quot;,
                &quot;us&quot;, or &quot;our&quot;) collects, uses, and discloses your personal
                information when you visit, use our services, or make a purchase from
                mepra-store.com.
              </p>

              <div id="collection" className="scroll-mt-24">
                <h2 className="text-2xl font-light text-foreground flex items-center gap-3">
                  <Eye className="w-5 h-5 text-secondary" />
                  Collection of Personal Information
                </h2>
                <p>
                  When you visit the Site, we collect certain information about your device, your
                  interaction with the Site, and information necessary to process your purchases. We
                  may also collect additional information if you contact us for customer support.
                </p>
                <ul>
                  <li>
                    <strong>Device Information:</strong> Version of web browser, IP address, time
                    zone, cookie information, what sites or products you view, search terms, and how
                    you interact with the Site.
                  </li>
                  <li>
                    <strong>Order Information:</strong> Name, billing address, shipping address,
                    payment information (including credit card numbers), email address, and phone
                    number.
                  </li>
                </ul>
              </div>

              <hr className="my-8 border-border" />

              <div id="usage" className="scroll-mt-24">
                <h2 className="text-2xl font-light text-foreground">
                  Usage of Personal Information
                </h2>
                <p>
                  We use your personal Information to provide our services to you, which includes:
                  offering products for sale, processing payments, shipping and fulfillment of your
                  order, and keeping you up to date on new products, services, and offers.
                </p>
              </div>

              <hr className="my-8 border-border" />

              <div id="sharing" className="scroll-mt-24">
                <h2 className="text-2xl font-light text-foreground">
                  Sharing Personal Information
                </h2>
                <p>
                  We share your Personal Information with service providers to help us provide our
                  services and fulfill our contracts with you, as described above. For example:
                </p>
                <ul>
                  <li>
                    We use <strong>Paymob</strong> to process payments.
                  </li>
                  <li>
                    We may share your information to comply with applicable laws and regulations, to
                    respond to a subpoena, search warrant or other lawful request for information we
                    receive, or to otherwise protect our rights.
                  </li>
                </ul>
              </div>

              <hr className="my-8 border-border" />

              <div id="security" className="scroll-mt-24">
                <h2 className="text-2xl font-light text-foreground flex items-center gap-3">
                  <Lock className="w-5 h-5 text-secondary" />
                  Security
                </h2>
                <p>
                  We value your trust in providing us your Personal Information, thus we are
                  striving to use commercially acceptable means of protecting it. All payment
                  transactions are encrypted using SSL technology. However, remember that no method
                  of transmission over the internet, or method of electronic storage is 100% secure
                  and reliable, and we cannot guarantee its absolute security.
                </p>
              </div>

              <hr className="my-8 border-border" />

              <div id="your rights" className="scroll-mt-24">
                <h2 className="text-2xl font-light text-foreground">Your Rights</h2>
                <p>
                  Depending on where you live, you may have the right to access the personal
                  information we hold about you and to ask that your personal information be
                  corrected, updated, or erased. If you would like to exercise this right, please
                  contact us through the contact information below.
                </p>
              </div>

              <div className="mt-12 p-6 bg-secondary/5 rounded-lg border border-secondary/10">
                <h3 className="text-lg font-medium text-foreground mb-2">Contact Us</h3>
                <p className="text-sm mb-0">
                  For more information about our privacy practices, if you have questions, or if you
                  would like to make a complaint, please contact us by e-mail at{" "}
                  <strong>info@mepra-store.com</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
