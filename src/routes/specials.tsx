import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgePercent, Loader2 } from "lucide-react";
import { PageBand } from "@/components/site/page-band";
import { SpecialOfferCard } from "@/components/site/special-offers";
import { useSpecialOffers } from "@/hooks/use-special-offers";

export const Route = createFileRoute("/specials")({
  head: () => ({
    meta: [
      { title: "Special Offers | Budget Jungle Gyms" },
      {
        name: "description",
        content: "Discover current special offers on handcrafted wooden jungle gyms.",
      },
      { property: "og:title", content: "Special Offers | Budget Jungle Gyms" },
      {
        property: "og:description",
        content: "Discover current special offers on handcrafted wooden jungle gyms.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/specials" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/specials" }],
  }),
  component: Specials,
});

function Specials() {
  const { offers, loading, error } = useSpecialOffers();

  return (
    <>
      <PageBand
        eyebrow="A little something special"
        title="Special offers"
        subtitle="Big backyard adventures, with a little extra joy in the price. Browse our current jungle gym deals below."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="animate-spin text-primary" aria-label="Loading special offers" />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center"
          >
            <p className="font-semibold text-foreground">{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please refresh the page to try again.
            </p>
          </div>
        ) : offers.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-[2rem] bg-cream px-6 py-12 text-center sm:px-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pale text-forest">
              <BadgePercent size={26} aria-hidden />
            </span>
            <h2 className="mt-5 font-display text-4xl text-foreground">New deals are on the way</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              We don't have any specials running right now. In the meantime, explore our full range
              and find the perfect fit for your garden.
            </p>
            <Link
              to="/jungle-gyms"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore our jungle gyms
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
