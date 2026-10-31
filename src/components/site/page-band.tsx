import leafDecor from "@/assets/leaf-decor.png";

/** Slim forest-green page band used at the top of interior pages. */
export function PageBand({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-forest py-14 text-center text-forest-foreground">
      <img
        src={leafDecor}
        alt=""
        aria-hidden
        width={160}
        height={160}
        loading="lazy"
        className="pointer-events-none absolute -left-6 -top-8 w-32 rotate-12 opacity-20 sm:w-44"
      />
      <img
        src={leafDecor}
        alt=""
        aria-hidden
        width={160}
        height={160}
        loading="lazy"
        className="pointer-events-none absolute -bottom-10 -right-8 w-36 -scale-x-100 rotate-6 opacity-20 sm:w-48"
      />
      <div className="mx-auto max-w-3xl px-4">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-leaf">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm text-forest-foreground/85 sm:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}
