export const metadata = {
  title: "Terms and Conditions | Mepra",
  description: "Terms and conditions for using the Mepra online store.",
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-foreground">Terms & Conditions</h1>
          <p className="text-muted-foreground mt-4">Last updated: December 6, 2025</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-xl border border-border shadow-sm prose prose-stone max-w-none text-muted-foreground">
          <h3>1. Introduction</h3>
          <p>
            Welcome to the Mepra online store. These Terms and Conditions govern your use of our
            website and the purchase of products from us. By accessing our site, you agree to be
            bound by these terms.
          </p>

          <h3>2. Intellectual Property</h3>
          <p>
            The content on this website, including text, graphics, logos, images, and software, is
            the property of Mepra S.p.A. or its content suppliers and is protected by international
            copyright laws. The compilation of all content on this site is the exclusive property of
            Mepra.
          </p>

          <h3>3. Product Information</h3>
          <p>
            We attempt to be as accurate as possible. However, Mepra does not warrant that product
            descriptions or other content of this site is accurate, complete, reliable, current, or
            error-free. If a product offered by Mepra itself is not as described, your sole remedy
            is to return it in unused condition.
          </p>

          <h3>4. Pricing and Payment</h3>
          <p>
            All prices are listed in the currency displayed on the site and are inclusive of VAT
            where applicable. We reserve the right to change prices at any time without notice.
            Payment must be made in full at the time of ordering.
          </p>

          <h3>5. Limitation of Liability</h3>
          <p>
            Mepra shall not be liable for any direct, indirect, incidental, special, or
            consequential damages that result from the use of, or the inability to use, the
            materials on this site or the performance of the products, even if Mepra has been
            advised of the possibility of such damages.
          </p>

          <h3>6. Governing Law</h3>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of
            Italy and the Netherlands. Any disputes relating to these terms and conditions will be
            subject to the exclusive jurisdiction of the courts of these jurisdictions.
          </p>

          <h3>7. Changes to Terms</h3>
          <p>
            We reserve the right, at our sole discretion, to update, change or replace any part of
            these Terms and Conditions by posting updates and changes to our website. It is your
            responsibility to check our website periodically for changes.
          </p>
        </div>
      </div>
    </div>
  );
}
