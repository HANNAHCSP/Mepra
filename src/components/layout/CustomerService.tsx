export default function CustomerService() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gray-600 italic mb-4">Customer service</p>
          <h2 className="text-4xl font-light text-gray-900">WE LOVE TO HELP</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          <div className="text-center space-y-4 max-w-[46ch] mx-auto">
            <h3 className="text-xl font-light text-gray-900 italic">Personal advice</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our products are not standard, so neither is our advice. Depending on your demands
              and wishes we will personalize your products exactly the way you want them. Mepra
              products with your personal touch!
            </p>
          </div>

          <div className="text-center space-y-4 max-w-[46ch] mx-auto">
            <h3 className="text-xl font-light text-gray-900 italic">Lifetime warranty</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Because of the way we design, build and test our flatware, we are confident that we
              make products that are the very best. If you have any problem with our flatware? We
              will solve it the best way we can.
            </p>
          </div>

          <div className="text-center space-y-4 max-w-[46ch] mx-auto">
            <h3 className="text-xl font-light text-gray-900 italic">Worldwide shipping</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Today Mepra products appear on the tables of the most prestigious hotels all around
              the world and private homes. We are used to international shipping. More information
              can be found on the <span className="underline cursor-pointer">shipping</span> page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
