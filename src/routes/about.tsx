import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, HeartHandshake, Hammer, TreePine } from "lucide-react";
import { PageBand } from "@/components/site/page-band";
import { heroJungleGym } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Budget Jungle Gyms" },
      {
        name: "description",
        content:
          "Learn the story behind Budget Jungle Gyms — handcrafted wooden play equipment that brings families together outdoors.",
      },
      { property: "og:title", content: "About Us | Budget Jungle Gyms" },
      {
        property: "og:description",
        content:
          "Learn the story behind Budget Jungle Gyms — handcrafted wooden play equipment that brings families together outdoors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const VALUES = [
  {
    icon: Hammer,
    title: "Crafted by Hand",
    text: "Every beam, bolt and bracket is fitted by our own experienced team, never mass produced.",
  },
  {
    icon: TreePine,
    title: "Timber with a Conscience",
    text: "We source responsibly grown, treated timber that stands up to weather and rough play.",
  },
  {
    icon: HeartHandshake,
    title: "Built Around Families",
    text: "From the first sketch to the final safety check, your family's needs lead the design.",
  },
];

function About() {
  return (
    <>
      <PageBand
        eyebrow="Our Story"
        title="Built for Childhood"
        subtitle="Budget Jungle Gyms was started by Abel Seleka in 2005 with one aim. To put smiles on the faces of the children of Mzansi. Since then the company has grown in leaps and bounds. Budget Jungle Gyms have done installations at schools, parks, nurseries, restaurants and 100's of private homes and flats."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-3xl shadow-md">
            <img
              src={heroJungleGym}
              alt="A Budget wooden jungle gym in a green backyard"
              width={1920}
              height={1088}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary sm:text-sm">
              More Than Just a Playground
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              It's a place for growth, adventure and joy.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Our wooden jungle gyms are more than just play equipment,they're a space where kids
              can climb, explore, imagine and grow. We design each structure to challenge little
              adventurers at every age, while giving parents complete peace of mind.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Whether you have a cosy backyard or room for a grand adventure, we create play spaces
              to suit your family. Each one is thoughtfully crafted, carefully safety-checked and
              ready to make outdoor memories for years to come.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-border bg-cream p-7 text-center transition-shadow hover:shadow-md"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pale text-forest">
                <Icon size={26} strokeWidth={1.6} aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-forest px-6 py-12 text-center text-forest-foreground">
          <h2 className="font-display text-4xl sm:text-5xl">
            <span className="text-leaf">Ready to build your family's adventure?</span>
          </h2>
          <Link
            to="/quote"
            search={{}}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3 text-sm font-semibold text-leaf-foreground transition-all hover:bg-leaf/90 hover:shadow-lg"
          >
            Get a Quote
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
