import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageBand } from "@/components/site/page-band";
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from "@/lib/site-data";

export const Route = createFileRoute("/gallery")({
  validateSearch: (search: Record<string, unknown>) => {
    const q = typeof search["q"] === "string" ? search["q"] : undefined;
    return q ? { q } : {};
  },
  head: () => ({
    meta: [
      { title: "Gallery | Budget Jungle Gyms" },
      {
        name: "description",
        content:
          "Browse photos of Budget wooden jungle gyms, playsets, towers and swing sets installed in real backyards.",
      },
      { property: "og:title", content: "Gallery | Budget Jungle Gyms" },
      {
        property: "og:description",
        content:
          "Browse photos of Budget wooden jungle gyms, playsets, towers and swing sets installed in real backyards.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/gallery" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof GALLERY_CATEGORIES)[number]>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(() => {
    let list = GALLERY_ITEMS.filter((item) => filter === "All" || item.category === filter);
    const query = q?.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query),
      );
    }
    return list;
  }, [filter, q]);

  // Keep the lightbox index valid when the list changes.
  useEffect(() => {
    if (lightbox !== null && lightbox >= items.length) setLightbox(null);
  }, [items.length, lightbox]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, items.length]);

  const current = lightbox !== null ? items[lightbox] : null;

  return (
    <>
      <PageBand
        eyebrow="Our Work"
        title="Gallery"
        subtitle="A glimpse of the adventures we've built — real Budget jungle gyms in real backyards."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {q && (
          <p className="mb-4 text-sm text-muted-foreground">
            Showing results for “{q}”.{" "}
            <button
              type="button"
              onClick={() => navigate({ to: "/gallery", search: {} })}
              className="font-semibold text-primary underline underline-offset-2"
            >
              Clear search
            </button>
          </p>
        )}

        {/* Filter chips */}
        <div
          className="flex flex-wrap justify-center gap-2.5"
          role="group"
          aria-label="Filter gallery by category"
        >
          {GALLERY_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                filter === category
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-cream text-foreground hover:bg-pale"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        {items.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted-foreground">
            No photos match this filter yet.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <button
                key={`${item.title}-${index}`}
                type="button"
                onClick={() => setLightbox(index)}
                className="group relative block overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label={`View larger photo: ${item.title}`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="card-shade absolute inset-0" aria-hidden />
                <p className="absolute bottom-3 left-4 text-sm font-semibold text-white drop-shadow">
                  {item.title}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2.5 text-white transition-colors hover:bg-white/30"
          >
            <X size={22} />
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i - 1 + items.length) % items.length));
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white transition-colors hover:bg-white/30"
          >
            <ChevronLeft size={24} />
          </button>
          <figure className="max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={current.src}
              alt={current.title}
              className="max-h-[78vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-sm font-medium text-white/90">
              {current.title}
            </figcaption>
          </figure>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i + 1) % items.length));
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white transition-colors hover:bg-white/30"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
}
