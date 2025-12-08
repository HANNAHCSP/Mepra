import { MapPin, Phone, Clock, Mail } from "lucide-react";

export const metadata = {
  title: "Locations | Mepra",
  description: "Visit our headquarters in Italy or our office in Egypt.",
};

const locations = [
  {
    city: "Lumezzane",
    country: "Italy",
    type: "Headquarters & Factory",
    address: "Via Montini, 176, 25067 Lumezzane BS",
    phone: "+39 030 892 1011",
    email: "export@mepra.it",
    image: "🇮🇹",
  },
  {
    city: "Cairo",
    country: "Egypt",
    type: "Regional Office & Showroom",
    address: "Downtown, Cairo Governorate",
    phone: "+20 2 2345 6789",
    email: "eg@mepra-store.com",
    image: "🇪🇬",
  },
];

export default function LocationsPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-foreground">Global Presence</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From our factory in Italy to our partners in Egypt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {locations.map((loc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-secondary/10 flex items-center justify-center text-8xl">
                {loc.image}
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-light text-foreground">{loc.city}</h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary border border-secondary/20 px-3 py-1 rounded-full">
                      {loc.country}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{loc.type}</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary/5 rounded-lg text-secondary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Visit Us
                      </p>
                      <span className="text-foreground">{loc.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary/5 rounded-lg text-secondary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Call Us
                      </p>
                      <a
                        href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                        className="text-foreground hover:text-secondary hover:underline transition-colors"
                      >
                        {loc.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary/5 rounded-lg text-secondary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Email Us
                      </p>
                      <a
                        href={`mailto:${loc.email}`}
                        className="text-foreground hover:text-secondary hover:underline transition-colors"
                      >
                        {loc.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
