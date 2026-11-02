import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgePercent, CalendarDays, Loader2 } from "lucide-react";
import { discountPercent, formatZar, type SpecialOffer } from "@/lib/special-offers";
import { useSpecialOffers } from "@/hooks/use-special-offers";

export function SpecialOfferCard({ offer }: { offer: SpecialOffer }) {
  const savings = discountPercent(offer.regular_price, offer.special_price);

  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={offer.image_url}
          alt={offer.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-leaf px-3 py-1.5 text-xs font-bold text-leaf-foreground shadow-sm">
          <BadgePercent size={15} aria-hidden />
          Save {savings}%
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-display text-3xl leading-tight text-foreground">{offer.title}</h3>
        <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed text-muted-foreground">
          {offer.description}
        </p>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-sm text-muted-foreground line-through">
            {formatZar(offer.regular_price)}
          </span>
          <span className="text-2xl font-bold text-primary">{formatZar(offer.special_price)}</span>
        </div>
        {offer.ends_at && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays size={14} aria-hidden />
            Offer ends{" "}
            {new Intl.DateTimeFormat("en-ZA", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(offer.ends_at))}
          </p>
        )}
        <Link
          to="/quote"
          search={{ gym: offer.title }}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
        >
          Ask about this special
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function HomeSpecialOffers() {
  const { offers, loading, error } = useSpecialOffers();
  const featuredOffers = offers.slice(0, 3);

  if (!loading && !error && featuredOffers.length === 0) return null;

  return (
    <section aria-labelledby="home-specials-heading" className="bg-cream py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Little price, big adventures
            </p>
            <h2
              id="home-specials-heading"
              className="mt-2 font-display text-4xl text-foreground sm:text-5xl"
            >
              Special offers
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Lovely deals on jungle gyms, ready to make your garden their favourite place.
            </p>
          </div>
          <Link
            to="/specials"
            className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:self-auto"
          >
            View all offers
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 flex min-h-48 items-center justify-center rounded-3xl border border-primary/10 bg-background">
            <Loader2 className="animate-spin text-primary" aria-label="Loading special offers" />
          </div>
        ) : error ? (
          <p
            role="status"
            className="mt-8 rounded-2xl bg-background p-5 text-sm text-muted-foreground"
          >
            {error} Please try again later.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredOffers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
