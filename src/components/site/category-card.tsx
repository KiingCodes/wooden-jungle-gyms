import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Category } from "@/lib/site-data";

/** Product category card matching the reference: photo, dark bottom gradient, name + circular arrow. */
export function CategoryCard({ category, size = "default" }: { category: Category; size?: "default" | "large" }) {
  return (
    <Link
      to="/jungle-gyms"
      hash={category.slug}
      className="group relative block overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label={`View ${category.name}`}
    >
      <img
        src={category.image}
        alt={category.name}
        width={1024}
        height={768}
        loading="lazy"
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
          size === "large" ? "aspect-[4/3]" : "aspect-[4/3]"
        }`}
      />
      <div className="card-shade absolute inset-0" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
        <h3 className="text-base font-bold text-white drop-shadow sm:text-lg">{category.name}</h3>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/15 text-white backdrop-blur-sm transition-all group-hover:bg-white/30"
          aria-hidden
        >
          <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
