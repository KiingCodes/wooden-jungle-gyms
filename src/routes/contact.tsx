import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageBand } from "@/components/site/page-band";
import { QuoteForm } from "@/components/site/quote-form";
import { CONTACT } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | WoodLand Jungle Gyms" },
      {
        name: "description",
        content: "Get in touch with WoodLand Jungle Gyms — request a quote, ask a question or visit our workshop.",
      },
      { property: "og:title", content: "Contact Us | WoodLand Jungle Gyms" },
      {
        property: "og:description",
        content: "Get in touch with WoodLand Jungle Gyms — request a quote, ask a question or visit our workshop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const CARDS = [
  {
    icon: Phone,
    title: "Call Us",
    line1: CONTACT.phoneDisplay,
    line2: "Mon–Fri, 08:00–17:00",
    href: CONTACT.phoneHref,
    linkLabel: `Call ${CONTACT.phoneDisplay}`,
  },
  {
    icon: Mail,
    title: "Email Us",
    line1: CONTACT.email,
    line2: "We reply within one business day",
    href: `mailto:${CONTACT.email}`,
    linkLabel: `Email ${CONTACT.email}`,
  },
  {
    icon: MapPin,
    title: "Visit Us",
    line1: CONTACT.address,
    line2: "Showground open by appointment",
  },
  {
    icon: Clock,
    title: "Trading Hours",
    line1: "Mon–Fri: 08:00–17:00",
    line2: "Sat: 09:00–13:00 · Sun: Closed",
  },
];

function Contact() {
  return (
    <>
      <PageBand
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Questions about sizing, installation or custom designs? Send us a message — we'd love to help."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {/* Contact cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ icon: Icon, title, line1, line2, href, linkLabel }) => (
            <div key={title} className="rounded-3xl border border-border bg-cream p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pale text-forest">
                <Icon size={22} strokeWidth={1.8} aria-hidden />
              </span>
              <h2 className="mt-3 text-base font-bold text-foreground">{title}</h2>
              {href ? (
                <a href={href} className="mt-2 block text-sm font-medium text-primary underline-offset-2 hover:underline">
                  {line1}
                  <span className="sr-only">{linkLabel}</span>
                </a>
              ) : (
                <p className="mt-2 text-sm font-medium text-foreground">{line1}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{line2}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Note: the contact details above are placeholders — update them with your real details before going live.
        </p>

        {/* Quote form */}
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary sm:text-sm">
              Request a Quote
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Let's design your dream jungle gym.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Fill in the form and our team will get back to you with a tailored quote for your space. Prefer to chat?
              Tap the WhatsApp button in the corner and message us directly.
            </p>
          </div>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
