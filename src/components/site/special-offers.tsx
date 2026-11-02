import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import {
  discountPercent,
  formatZar,
  parseOfferDescription,
  type SpecialOffer,
} from "@/lib/special-offers";
import { useSpecialOffers } from "@/hooks/use-special-offers";

export function SpecialOfferCard({ offer }: { offer: SpecialOffer }) {
  const [activeImage, setActiveImage] = useState(0);
  const savings = discountPercent(offer.regular_price, offer.special_price);
  const images = offer.image_urls.length > 0 ? offer.image_urls : [offer.image_url];
  const descriptionBlocks = parseOfferDescription(offer.description);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_12px_36px_-20px_rgba(27,65,41,0.42)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_-20px_rgba(27,65,41,0.5)]">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-cream">
        <img
          src={images[activeImage]}
          alt={`${offer.title} photo ${activeImage + 1} of ${images.length}`}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-forest/90 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
          <BadgePercent size={15} aria-hidden />
          Save {savings}%
        </span>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveImage((current) => (current - 1 + images.length) % images.length)
              }
              aria-label={`Previous photo of ${offer.title}`}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur transition hover:scale-105 hover:bg-background"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setActiveImage((current) => (current + 1) % images.length)}
              aria-label={`Next photo of ${offer.title}`}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur transition hover:scale-105 hover:bg-background"
            >
              <ChevronRight size={20} aria-hidden />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={`${offer.id}-image-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show photo ${index + 1} of ${images.length}`}
                  aria-current={activeImage === index}
                  className={`h-2.5 rounded-full border border-white/80 shadow-sm transition-all ${
                    activeImage === index ? "w-6 bg-white" : "w-2.5 bg-white/55 hover:bg-white/85"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-3xl leading-tight text-foreground">{offer.title}</h3>
        <div className="mt-3 min-h-24 flex-1 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
          {descriptionBlocks.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h4 key={`heading-${index}`} className="pt-1 font-bold text-forest">
                  {block.text}
                </h4>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={`list-${index}`} className="space-y-1.5">
                  {block.items.map((item, itemIndex) => (
                    <li key={`${index}-${itemIndex}`} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pale text-forest">
                        <Check size={11} strokeWidth={3} aria-hidden />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={`paragraph-${index}`}>{block.text}</p>;
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-border/70 pt-4">
          <span className="text-sm text-muted-foreground line-through">
            {formatZar(offer.regular_price)}
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-primary">
            {formatZar(offer.special_price)}
          </span>
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
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
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
