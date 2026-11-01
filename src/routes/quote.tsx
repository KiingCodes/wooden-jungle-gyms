import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, MessageCircle, Truck } from "lucide-react";
import { PageBand } from "@/components/site/page-band";
import { QuoteForm } from "@/components/site/quote-form";
import { CONTACT } from "@/lib/site-data";

export const Route = createFileRoute("/quote")({
  validateSearch: (search: Record<string, unknown>) => {
    const gym = typeof search["gym"] === "string" ? search["gym"] : undefined;
    return gym ? { gym } : {};
  },
  head: () => ({
    meta: [
      { title: "Get a Quote | WoodLand Jungle Gyms" },
      {
        name: "description",
        content:
          "Request a free quote for your WoodLand wooden jungle gym tailored to your space, your style and your kids.",
      },
      { property: "og:title", content: "Get a Quote | WoodLand Jungle Gyms" },
      {
        property: "og:description",
        content:
          "Request a free quote for your WoodLand wooden jungle gym tailored to your space, your style and your kids.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quote,
});

const POINTS = [
  { icon: ClipboardCheck, text: "A tailored quote for your space and budget" },
  { icon: MessageCircle, text: "Friendly advice on the best fit for your kids' ages" },
  { icon: Truck, text: "Delivery and professional installation arranged for you" },
];

function Quote() {
  const { gym } = Route.useSearch();
  const defaultGym = gym && gym.length <= 100 ? gym : undefined;

  return (
    <>
      <PageBand
        eyebrow="Free Consultation"
        title="Get a Quote"
        subtitle="Tell us a little about your family and your space, and we'll put together the perfect jungle gym proposal."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="lg:sticky lg:top-24">
            <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              What happens next?
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pale text-forest">
                    <Icon size={18} strokeWidth={1.8} aria-hidden />
                  </span>
                  <p className="pt-1.5 text-sm text-foreground sm:text-base">{text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-2xl bg-cream p-5 text-sm leading-relaxed text-muted-foreground">
              Prefer to chat first? Message us on WhatsApp or call{" "}
              <a href={CONTACT.phoneHref} className="font-semibold text-primary hover:underline">
                {CONTACT.phoneDisplay}
              </a>
              .
            </p>
          </div>
          <QuoteForm defaultGym={defaultGym} />
        </div>
      </section>
    </>
  );
}
