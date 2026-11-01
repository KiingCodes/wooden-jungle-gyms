import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { PageBand } from "@/components/site/page-band";
import { CATEGORIES } from "@/lib/site-data";

export const Route = createFileRoute("/jungle-gyms")({
  head: () => ({
    meta: [
      { title: "Our Jungle Gyms | WoodLand Jungle Gyms" },
      {
        name: "description",
        content:
          "Explore our range of handcrafted wooden jungle gyms: classic playsets, adventure towers, custom builds and accessories.",
      },
      { property: "og:title", content: "Our Jungle Gyms | WoodLand Jungle Gyms" },
      {
        property: "og:description",
        content:
          "Explore our range of handcrafted wooden jungle gyms: classic playsets, adventure towers, custom builds and accessories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JungleGyms,
});

function JungleGyms() {
  return (
    <>
      <PageBand
        eyebrow="Our Range"
        title="Our Jungle Gyms"
        subtitle="Every WoodLand jungle gym is handcrafted from premium, treated timber and built to keep kids playing safely for years."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {CATEGORIES.map((category, index) => (
          <section
            key={category.slug}
            id={category.slug}
            aria-labelledby={`${category.slug}-heading`}
            className="scroll-mt-24 py-14"
          >
            <div
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-3xl shadow-md">
                <img
                  src={category.image}
                  alt={category.name}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  {category.tagline}
                </p>
                <h2
                  id={`${category.slug}-heading`}
                  className="mt-2 font-display text-4xl text-foreground sm:text-5xl"
                >
                  {category.name}
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {category.description}
                </p>
                <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {category.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pale text-forest">
                        <Check size={13} strokeWidth={3} aria-hidden />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    to="/quote"
                    search={{ gym: category.name }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
                  >
                    Get a Quote for {category.name}
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Closing CTA */}
        <section className="my-6 mb-16 overflow-hidden rounded-3xl bg-forest px-6 py-12 text-center text-forest-foreground">
          <h2 className="font-display text-4xl sm:text-5xl">
            <span className="text-leaf">Not sure which one fits your space?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-forest-foreground/85 sm:text-base">
            Tell us about your garden and your kids, and we'll recommend the perfect jungle gym for
            your family.
          </p>
          <Link
            to="/quote"
            search={{}}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3 text-sm font-semibold text-leaf-foreground transition-all hover:bg-leaf/90 hover:shadow-lg"
          >
            Request a Free Consultation
            <ChevronRight size={16} />
          </Link>
        </section>
      </div>
    </>
  );
}
