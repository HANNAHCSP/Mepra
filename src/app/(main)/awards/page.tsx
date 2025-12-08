import { Award, Star, Trophy } from "lucide-react";

export const metadata = {
  title: "Awards & Recognition | Mepra",
  description: "Celebrating Italian design excellence.",
};

const awards = [
  { title: "Good Design Award", year: "2023", org: "Chicago Athenaeum", icon: Award },
  { title: "Red Dot Design Award", year: "2022", org: "Design Zentrum", icon: Star },
  { title: "Design Plus", year: "2020", org: "Ambiente", icon: Trophy },
  { title: "Wallpaper* Design Award", year: "2019", org: "Wallpaper*", icon: Award },
  { title: "Host Smart Label", year: "2018", org: "Host Milano", icon: Star },
  { title: "ADI Design Index", year: "2017", org: "ADI", icon: Trophy },
];

export default function AwardsPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-foreground">Excellence Recognized</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our commitment to design and innovation has been acknowledged by the world&apos;s most
            prestigious institutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-xl border border-border shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-6">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-foreground">{item.title}</h3>
              <p className="text-secondary font-medium mt-1">{item.year}</p>
              <p className="text-sm text-muted-foreground mt-2">{item.org}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
