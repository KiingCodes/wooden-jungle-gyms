import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ChevronRight,
  Dumbbell,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { CategoryCard } from "@/components/site/category-card";
import { CATEGORIES, aboutChild, heroJungleGym } from "@/lib/site-data";
import leafDecor from "@/assets/leaf-decor.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "WoodLand Jungle Gyms | Wooden Jungle Gyms, Playsets & Swings",
      },
      {
        name: "description",
        content:
          "Beautifully crafted wooden jungle gyms designed to inspire active play, build confidence and create unforgettable childhood moments.",
      },
      { property: "og:title", content: "WoodLand Jungle Gyms | Real Play. Lasting Memories." },
      {
        property: "og:description",
        content:
          "Beautifully crafted wooden jungle gyms designed to inspire active play, build confidence and create unforgettable childhood moments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Leaf, title: "Premium Quality Wood", text: "Durable, safe and built to last for years." },
  { icon: ShieldCheck, title: "Child Safety First", text: "Designed with safety in mind, always." },
  { icon: Wrench, title: "Custom Designs", text: "Tailored to your space, your style, your kids." },
  { icon: Truck, title: "Nationwide Delivery", text: "We bring the adventure to your doorstep." },
];

const BENEFITS: { icon: LucideIcon; title: string; rest: string }[] = [
  { icon: Activity, title: "Encourages active play", rest: "and healthy living" },
  { icon: Dumbbell, title: "Builds strength, balance", rest: "and coordination" },
  { icon: Lightbulb, title: "Sparks creativity", rest: "and imagination" },
  { icon: Users, title: "Brings families together", rest: "outdoors" },
];

function Index() {
  return (
    <>
      {/* ============ Hero ============ */}
      <section className="relative">
        <img
          src={heroJungleGym}
          alt="Children playing on a wooden jungle gym with a green slide and swings in a lush backyard"
          width={1920}
          height={1088}
          className="h-[420px] w-full object-cover object-right sm:h-[400px] lg:h-[420px]"
        />
        <div className="hero-shade absolute inset-0" aria-hidden />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-leaf sm:text-sm">
                Wooden Jungle Gyms
              </p>
              <h1 className="mt-3 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
                <span className="text-white">Real Play.</span>
                <br />
                <span className="text-leaf">Lasting Memories.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
                Beautifully crafted wooden jungle gyms, designed to inspire active play, build confidence and create
                unforgettable childhood moments.
              </p>
              <Link
                to="/jungle-gyms"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-semibold text-leaf-foreground shadow-md transition-all hover:bg-leaf/90 hover:shadow-lg sm:text-base"
              >
                Explore Our Jungle Gyms
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
        {/* Cream wave where the features strip begins */}
        <svg
          className="absolute bottom-0 left-0 h-[52px] w-full sm:h-[64px]"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 64 L0 46 C 300 6 620 60 940 38 C 1160 24 1330 44 1440 30 L1440 64 Z"
            fill="var(--cream)"
          />
        </svg>
      </section>

      {/* ============ Features strip ============ */}
      <section aria-label="Why choose WoodLand" className="-mt-11 bg-cream pb-14 pt-14 sm:-mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-0 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className={`flex flex-col items-center px-6 text-center ${
                  i > 0 ? "sm:border-l sm:border-primary/15" : ""
                }`}
              >
                <Icon size={38} strokeWidth={1.4} className="text-primary" aria-hidden />
                <h2 className="mt-3 text-base font-bold text-foreground sm:text-lg">{title}</h2>
                <p className="mt-1.5 max-w-[16rem] text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ About ============ */}
      <section aria-labelledby="about-heading" className="overflow-hidden bg-background py-4 lg:py-10">
        <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-8">
          {/* Photo bleeding to the left edge on desktop */}
          <div className="overflow-hidden lg:rounded-r-3xl">
            <img
              src={aboutChild}
              alt="A happy child playing inside a wooden jungle gym"
              width={1024}
              height={768}
              loading="lazy"
              className="h-64 w-full object-cover sm:h-80 lg:h-full"
            />
          </div>

          {/* Copy */}
          <div className="order-2 flex flex-col justify-center px-4 sm:px-6 lg:order-none lg:px-0 lg:py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary sm:text-sm">
              More Than Just a Playground
            </p>
            <h2
              id="about-heading"
              className="mt-3 max-w-md font-display text-4xl leading-tight text-foreground sm:text-5xl"
            >
              It's a place for growth, adventure and joy.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Our wooden jungle gyms are more than just play equipment — they're a space where kids can climb, explore,
              imagine and grow.
            </p>
            <div className="mt-7">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
              >
                About Our Story
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          {/* Benefits panel */}
          <div className="relative order-1 px-4 sm:px-6 lg:order-none lg:px-0">
            <div className="panel-organic relative bg-pale px-7 py-8 sm:px-9">
              <ul className="flex flex-col gap-5">
                {BENEFITS.map(({ icon: Icon, title, rest }) => (
                  <li key={title} className="flex items-start gap-3.5">
                    <Icon size={24} strokeWidth={1.6} className="mt-0.5 shrink-0 text-forest" aria-hidden />
                    <p className="text-sm leading-snug text-pale-foreground">
                      <span className="font-semibold text-foreground">{title}</span>
                      <br />
                      {rest}
                    </p>
                  </li>
                ))}
              </ul>
              <img
                src={leafDecor}
                alt=""
                aria-hidden
                width={160}
                height={160}
                loading="lazy"
                className="pointer-events-none absolute -right-12 bottom-6 hidden w-32 rotate-6 lg:block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ Collection ============ */}
      <section aria-labelledby="collection-heading" className="bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 id="collection-heading" className="font-display text-4xl text-foreground sm:text-5xl">
              <span className="mr-4 hidden h-px w-12 translate-y-[-6px] bg-primary/50 align-middle md:inline-block" />
              Our Jungle Gyms Collection
              <span className="ml-4 hidden h-px w-12 translate-y-[-6px] bg-primary/50 align-middle md:inline-block" />
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              From smaller backyard setups to large adventure parks, we have the perfect fit for your space and budget.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
