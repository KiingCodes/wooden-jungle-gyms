import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { CATEGORIES } from "@/lib/site-data";

const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(25),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  preferred_gym: z.string().trim().min(1, "Please choose a jungle gym").max(100),
  location: z.string().trim().min(2, "Please tell us where you are located").max(200),
  requirements: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof quoteSchema>, string>>;

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring";
const labelClass = "mb-1.5 block text-sm font-semibold text-foreground";
const errorClass = "mt-1 text-xs font-medium text-destructive";

export function QuoteForm({ defaultGym }: { defaultGym?: string | undefined }) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    const parsed = quoteSchema.safeParse({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      preferred_gym: String(data.get("preferred_gym") ?? ""),
      location: String(data.get("location") ?? ""),
      requirements: String(data.get("requirements") ?? ""),
    });

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const { error } = await supabase.from("quote_requests").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      preferred_gym: parsed.data.preferred_gym,
      location: parsed.data.location,
      requirements: parsed.data.requirements || null,
    });

    setSubmitting(false);
    if (error) {
      setSubmitError("Something went wrong while sending your request. Please try again.");
      return;
    }
    setSuccess(true);
    form.reset();
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <CheckCircle2 size={56} className="mx-auto text-primary" aria-hidden />
        <h2 className="mt-4 font-display text-4xl text-primary">Thank you!</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Your quote request has been received. Our team will get back to you as soon as possible to
          discuss your perfect jungle gym.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Send another request
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
      aria-label="Quote request form"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-name" className={labelClass}>
            Customer Name
          </label>
          <input
            id="quote-name"
            name="name"
            className={inputClass}
            placeholder="Your full name"
            required
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="quote-phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            className={inputClass}
            placeholder="e.g. 082 000 0000"
            required
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="quote-email" className={labelClass}>
            Email Address
          </label>
          <input
            id="quote-email"
            name="email"
            type="email"
            className={inputClass}
            placeholder="you@example.com"
            required
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="quote-gym" className={labelClass}>
            Preferred Jungle Gym
          </label>
          <select
            id="quote-gym"
            name="preferred_gym"
            className={inputClass}
            defaultValue={defaultGym ?? ""}
            required
          >
            <option value="" disabled>
              Select a category…
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
            {defaultGym && !CATEGORIES.some((category) => category.name === defaultGym) && (
              <option value={defaultGym}>{defaultGym}</option>
            )}
            <option value="Not sure yet">Not sure yet — advise me</option>
          </select>
          {errors.preferred_gym && <p className={errorClass}>{errors.preferred_gym}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="quote-location" className={labelClass}>
            Location
          </label>
          <input
            id="quote-location"
            name="location"
            className={inputClass}
            placeholder="Suburb and city where the jungle gym will be installed"
            required
          />
          {errors.location && <p className={errorClass}>{errors.location}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="quote-requirements" className={labelClass}>
            Additional Requirements
          </label>
          <textarea
            id="quote-requirements"
            name="requirements"
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Tell us about your space, the age of your kids, or anything special you have in mind…"
          />
          {errors.requirements && <p className={errorClass}>{errors.requirements}</p>}
        </div>
      </div>

      {submitError && (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {submitting ? (
          <>
            Sending…
            <Loader2 size={16} className="animate-spin" />
          </>
        ) : (
          <>
            Request My Quote
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
