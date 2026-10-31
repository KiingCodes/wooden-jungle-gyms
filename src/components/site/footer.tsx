import logoIcon from "@/assets/logo-icon.png";
import { Leaf, ShieldCheck, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Safe & Durable" },
  { icon: Leaf, label: "Eco-Friendly Materials" },
  { icon: Truck, label: "Nationwide Delivery" },
];

export function Footer() {
  return (
    <footer className="bg-forest text-forest-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[auto_minmax(0,1fr)_auto] lg:grid-cols-[auto_auto_1fr_auto] lg:gap-8">
          {/* Logo */}
          <Link to="/" className="flex justify-center lg:justify-start" aria-label="WoodLand Jungle Gyms home">
            <img src={logoIcon} alt="" width={48} height={48} className="h-12 w-12 object-contain" loading="lazy" />
          </Link>

          {/* Slogan */}
          <p className="text-center font-display text-2xl leading-none sm:text-3xl lg:text-left">
            <span className="text-leaf">Play Today.</span>{" "}
            <span className="text-forest-foreground/85">Stronger Tomorrow.</span>
          </p>

          {/* Highlights */}
          <ul className="flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon size={18} className="text-leaf" aria-hidden />
                <span className="text-forest-foreground/90">{label}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex justify-center lg:justify-end">
            <Link
              to="/quote"
              search={{}}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-forest-foreground/80 px-5 py-2 text-sm font-semibold text-forest-foreground transition-colors hover:border-forest-foreground hover:bg-forest-foreground hover:text-forest"
            >
              Get a Quote
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-forest-foreground/15">
        <p className="mx-auto max-w-7xl px-4 py-3 text-center text-xs text-forest-foreground/60 sm:px-6">
          © {new Date().getFullYear()} WoodLand Jungle Gyms. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
