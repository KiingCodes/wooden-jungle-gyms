import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus, Loader2, LogOut, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { PageBand } from "@/components/site/page-band";
import { supabase } from "@/integrations/supabase/client";
import {
  discountPercent,
  formatZar,
  getOfferImagePaths,
  isOfferInDateRange,
  southAfricanDateKey,
  type SpecialOffer,
} from "@/lib/special-offers";

const IMAGE_BUCKET = "special-offer-images";
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring";
const labelClass = "mb-1.5 block text-sm font-semibold text-foreground";

type OfferDraft = {
  title: string;
  description: string;
  regularPrice: string;
  specialPrice: string;
  startsAt: string;
  endsAt: string;
  isPublished: boolean;
  imagePaths: string[];
  imageFiles: File[];
};

function emptyDraft(): OfferDraft {
  return {
    title: "",
    description: "",
    regularPrice: "",
    specialPrice: "",
    startsAt: "",
    endsAt: "",
    isPublished: false,
    imagePaths: [],
    imageFiles: [],
  };
}

function draftFromOffer(offer: SpecialOffer): OfferDraft {
  return {
    title: offer.title,
    description: offer.description,
    regularPrice: String(offer.regular_price),
    specialPrice: String(offer.special_price),
    startsAt: offer.starts_at ?? "",
    endsAt: offer.ends_at ?? "",
    isPublished: offer.is_published,
    imagePaths: getOfferImagePaths(offer),
    imageFiles: [],
  };
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Specials Admin | Budget Jungle Gyms" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [access, setAccess] = useState<"signed-out" | "checking" | "allowed" | "denied" | "error">(
    "checking",
  );
  const [accessError, setAccessError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<OfferDraft | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setCheckingSession(false);
      setAuthMessage(null);
      setAuthError(null);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setCheckingSession(false);
      if (error) {
        setAuthError("We couldn't check your sign-in. Please refresh and try again.");
        console.error("Could not check Supabase session:", error);
        return;
      }
      setSession(data.session);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!session) {
      setAccess("signed-out");
      setAccessError(null);
      setOffers([]);
      return () => {
        active = false;
      };
    }

    setAccess("checking");
    setAccessError(null);
    if (!session.user.email) {
      setAccess("denied");
      return () => {
        active = false;
      };
    }

    void supabase
      .from("admin_users")
      .select("email")
      .eq("email", session.user.email.toLowerCase())
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (!active) return;
        if (error) {
          setAccess("error");
          setAccessError("We couldn't verify admin access. Please try again later.");
          console.error("Could not verify special-offers admin access:", error);
          return;
        }
        if (!data) {
          setAccess("denied");
          await supabase.auth.signOut();
          return;
        }
        setAccess("allowed");
      });

    return () => {
      active = false;
    };
  }, [session]);

  useEffect(() => {
    let active = true;
    if (access !== "allowed") return;
    setLoadingOffers(true);
    void supabase
      .from("special_offers")
      .select("*")
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        setLoadingOffers(false);
        if (error) {
          setFormError("Your offers could not be loaded. Please refresh and try again.");
          console.error("Could not load special offers for admin:", error);
          return;
        }
        setOffers(data ?? []);
      });

    return () => {
      active = false;
    };
  }, [access]);

  useEffect(() => {
    if (!draft?.imageFiles.length) {
      setImagePreviews([]);
      return;
    }
    const previews = draft.imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [draft?.imageFiles]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError(null);
    setAuthMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setAuthError("We couldn't sign you in. Check your email and password, then try again.");
      console.error("Special-offers admin sign-in failed:", error);
      return;
    }
    setPassword("");
  }

  async function handlePasswordReset() {
    setAuthError(null);
    setAuthMessage(null);
    if (!email.trim()) {
      setAuthError("Enter your admin email address first, then choose reset password.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin`,
    });
    if (error) {
      setAuthError("We couldn't send a password reset email. Please try again later.");
      console.error("Could not send admin password reset email:", error);
      return;
    }
    setAuthMessage("If that email belongs to an account, a password reset link is on its way.");
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError("We couldn't sign you out. Please try again.");
      console.error("Special-offers admin sign-out failed:", error);
    }
  }

  function startNewOffer() {
    setEditingId(null);
    setDraft(emptyDraft());
    setFormError(null);
    setFormMessage(null);
  }

  function startEdit(offer: SpecialOffer) {
    setEditingId(offer.id);
    setDraft(draftFromOffer(offer));
    setFormError(null);
    setFormMessage(null);
    document.getElementById("offer-editor")?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
    setFormError(null);
    setFormMessage(null);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !session) return;
    setFormError(null);
    setFormMessage(null);

    const regularPrice = Number(draft.regularPrice);
    const specialPrice = Number(draft.specialPrice);
    if (!draft.title.trim() || draft.title.trim().length > 100) {
      setFormError("Add a title between 1 and 100 characters.");
      return;
    }
    if (!draft.description.trim() || draft.description.trim().length > 2000) {
      setFormError("Add a description between 1 and 2,000 characters.");
      return;
    }
    if (!Number.isFinite(regularPrice) || !Number.isFinite(specialPrice) || regularPrice <= 0) {
      setFormError("Enter valid prices greater than zero.");
      return;
    }
    if (specialPrice <= 0 || specialPrice >= regularPrice) {
      setFormError("The special price must be greater than zero and lower than the regular price.");
      return;
    }
    if (draft.startsAt && draft.endsAt && draft.startsAt > draft.endsAt) {
      setFormError("The end date must be on or after the start date.");
      return;
    }
    if (draft.imagePaths.length + draft.imageFiles.length < 2) {
      setFormError("Add at least two product photos to create a special offer.");
      return;
    }
    if (
      draft.imageFiles.some(
        (file) => !ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE,
      )
    ) {
      setFormError("Each photo must be JPG, PNG or WebP and smaller than 8 MB.");
      return;
    }

    setSaving(true);
    const uploadedPaths: string[] = [];
    const extensionByType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    for (const file of draft.imageFiles) {
      const path = `${session.user.id}/${crypto.randomUUID()}.${extensionByType[file.type]}`;
      const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });
      if (error) {
        setSaving(false);
        const cleanup = uploadedPaths.length
          ? await supabase.storage.from(IMAGE_BUCKET).remove(uploadedPaths)
          : { error: null };
        setFormError(
          cleanup.error
            ? "A photo upload failed, and some uploaded photos could not be cleaned up."
            : "A photo upload failed. Please try again with JPG, PNG or WebP photos smaller than 8 MB.",
        );
        console.error("Could not upload special-offer image:", error);
        if (cleanup.error)
          console.error("Could not clean up offer images after failed upload:", cleanup.error);
        return;
      }
      uploadedPaths.push(path);
    }
    const imagePaths = [...draft.imagePaths, ...uploadedPaths];

    const offerValues = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      regular_price: regularPrice,
      special_price: specialPrice,
      image_path: imagePaths[0],
      images: imagePaths,
      is_published: draft.isPublished,
      starts_at: draft.startsAt || null,
      ends_at: draft.endsAt || null,
    };

    const result = editingId
      ? await supabase
          .from("special_offers")
          .update(offerValues)
          .eq("id", editingId)
          .select("*")
          .single()
      : await supabase.from("special_offers").insert(offerValues).select("*").single();

    if (result.error) {
      setSaving(false);
      let cleanupMessage = "";
      if (uploadedPaths.length) {
        const cleanup = await supabase.storage.from(IMAGE_BUCKET).remove(uploadedPaths);
        if (cleanup.error) {
          cleanupMessage = " The uploaded image also needs manual cleanup.";
          console.error("Could not remove unused special-offer image:", cleanup.error);
        }
      }
      setFormError(`The offer couldn't be saved.${cleanupMessage} Please try again.`);
      console.error("Could not save special offer:", result.error);
      return;
    }

    const oldOffer = offers.find((offer) => offer.id === editingId);
    setOffers((current) => [
      result.data,
      ...current.filter((offer) => offer.id !== result.data.id),
    ]);
    setSaving(false);
    setEditingId(null);
    setDraft(null);
    const removedPaths = oldOffer
      ? getOfferImagePaths(oldOffer).filter((path) => !imagePaths.includes(path))
      : [];
    if (removedPaths.length) {
      const cleanup = await supabase.storage.from(IMAGE_BUCKET).remove(removedPaths);
      if (cleanup.error) {
        setFormMessage("The offer was saved, but its previous image could not be removed.");
        console.error("Could not remove replaced special-offer image:", cleanup.error);
      } else {
        setFormMessage("Your special offer has been saved.");
      }
    } else {
      setFormMessage("Your special offer has been saved.");
    }
  }

  async function handleDelete(offer: SpecialOffer) {
    if (!window.confirm(`Delete "${offer.title}"? This can't be undone.`)) return;
    setDeletingId(offer.id);
    setFormError(null);
    setFormMessage(null);
    const { error } = await supabase.from("special_offers").delete().eq("id", offer.id);
    if (error) {
      setDeletingId(null);
      setFormError("The offer couldn't be deleted. Please try again.");
      console.error("Could not delete special offer:", error);
      return;
    }
    setOffers((current) => current.filter((item) => item.id !== offer.id));
    const cleanup = await supabase.storage.from(IMAGE_BUCKET).remove(getOfferImagePaths(offer));
    setDeletingId(null);
    if (cleanup.error) {
      setFormMessage("The offer was deleted, but its image could not be removed.");
      console.error("Could not remove deleted special-offer image:", cleanup.error);
    } else {
      setFormMessage("The special offer has been deleted.");
    }
  }

  if (checkingSession || access === "checking") {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" aria-label="Checking admin access" />
      </div>
    );
  }

  if (access === "denied") {
    return (
      <section className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
          <h1 className="font-display text-4xl text-foreground">Admin access required</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This account isn't on the specials admin list. Ask your Supabase project owner to
            approve your email address, then sign in again.
          </p>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Sign out
          </button>
        </div>
      </section>
    );
  }

  if (access === "error") {
    return (
      <section className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
          <h1 className="font-display text-4xl text-foreground">Can't verify access</h1>
          <p role="alert" className="mt-3 text-sm text-muted-foreground">
            {accessError}
          </p>
          <button
            type="button"
            onClick={() => setSession((current) => (current ? { ...current } : current))}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (access === "signed-out") {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            <ArrowLeft size={16} aria-hidden />
            Back to the website
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Specials dashboard
          </p>
          <h1 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your approved admin account to manage offers.
          </p>
          <form
            onSubmit={(event) => void handleSignIn(event)}
            className="mt-7 flex flex-col gap-4"
            aria-label="Admin sign in"
          >
            <div>
              <label htmlFor="admin-email" className={labelClass}>
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className={labelClass}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </div>
            {authError && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {authError}
              </p>
            )}
            {authMessage && (
              <p role="status" className="text-sm font-medium text-primary">
                {authMessage}
              </p>
            )}
            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => void handlePasswordReset()}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Forgot your password?
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageBand
        eyebrow="Admin dashboard"
        title="Special offers"
        subtitle="Create a lovely offer, add a product photo, and choose exactly when it appears on the website."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/specials"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft size={16} aria-hidden />
            View public offers page
          </Link>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
          >
            <LogOut size={16} aria-hidden />
            Sign out
          </button>
        </div>
        {authError && (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
          >
            {authError}
          </p>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
          <section aria-labelledby="offers-list-heading" className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="offers-list-heading" className="font-display text-4xl text-foreground">
                  Your offers
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {offers.length} {offers.length === 1 ? "offer" : "offers"} saved
                </p>
              </div>
              <button
                type="button"
                onClick={startNewOffer}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus size={17} aria-hidden />
                New offer
              </button>
            </div>

            {formError && !draft && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
              >
                {formError}
              </p>
            )}
            {formMessage && (
              <p
                role="status"
                className="mt-4 rounded-xl bg-pale p-4 text-sm font-semibold text-forest"
              >
                {formMessage}
              </p>
            )}

            {loadingOffers ? (
              <div className="flex min-h-48 items-center justify-center">
                <Loader2 className="animate-spin text-primary" aria-label="Loading offers" />
              </div>
            ) : offers.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-border bg-cream px-6 py-12 text-center">
                <ImagePlus size={34} className="mx-auto text-primary" aria-hidden />
                <h3 className="mt-4 font-display text-3xl text-foreground">
                  Your first offer starts here
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Add a great photo, set your prices and publish when you're ready.
                </p>
                <button
                  type="button"
                  onClick={startNewOffer}
                  className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Create your first offer
                </button>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                {offers.map((offer) => {
                  const status = !offer.is_published
                    ? "Draft"
                    : !isOfferInDateRange(offer)
                      ? "Scheduled / ended"
                      : "Live";
                  return (
                    <article
                      key={offer.id}
                      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
                    >
                      <img
                        src={
                          supabase.storage
                            .from(IMAGE_BUCKET)
                            .getPublicUrl(getOfferImagePaths(offer)[0]).data.publicUrl
                        }
                        alt=""
                        className="h-28 w-full rounded-xl object-cover sm:w-36"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-semibold text-foreground">{offer.title}</h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${status === "Live" ? "bg-pale text-forest" : "bg-muted text-muted-foreground"}`}
                          >
                            {status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-bold text-primary">
                          {formatZar(offer.special_price)}
                          <span className="ml-2 font-normal text-muted-foreground line-through">
                            {formatZar(offer.regular_price)}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {discountPercent(offer.regular_price, offer.special_price)}% off
                          {offer.ends_at ? ` · Ends ${offer.ends_at}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2 sm:flex-col">
                        <button
                          type="button"
                          onClick={() => startEdit(offer)}
                          aria-label={`Edit ${offer.title}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold hover:bg-accent"
                        >
                          <Pencil size={14} aria-hidden />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(offer)}
                          disabled={deletingId === offer.id}
                          aria-label={`Delete ${offer.title}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-destructive/20 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/5 disabled:opacity-50"
                        >
                          {deletingId === offer.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} aria-hidden />
                          )}
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {draft && (
            <section
              id="offer-editor"
              aria-labelledby="offer-editor-heading"
              className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    {editingId ? "Update listing" : "Create listing"}
                  </p>
                  <h2
                    id="offer-editor-heading"
                    className="mt-1 font-display text-3xl text-foreground"
                  >
                    {editingId ? "Edit your offer" : "New special offer"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-accent"
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={(event) => void handleSave(event)}
                className="mt-6 flex flex-col gap-4"
              >
                <div>
                  <label htmlFor="offer-title" className={labelClass}>
                    Offer title
                  </label>
                  <input
                    id="offer-title"
                    required
                    maxLength={100}
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    placeholder="e.g. The Little Explorer"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="offer-description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    id="offer-description"
                    required
                    maxLength={2000}
                    rows={7}
                    value={draft.description}
                    onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                    placeholder={
                      "The perfect backyard adventure:\n• Raised play deck with timber roof\n• Wave slide and climbing wall\n\nWhat's included:\n- Professional installation"
                    }
                    className={`${inputClass} resize-y`}
                  />
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Use a new line for each detail. Start bullet points with • or -, and add a
                    section heading with a colon (for example, What's included:). Blank lines
                    separate sections.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="offer-regular-price" className={labelClass}>
                      Regular price (R)
                    </label>
                    <input
                      id="offer-regular-price"
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={draft.regularPrice}
                      onChange={(event) => setDraft({ ...draft, regularPrice: event.target.value })}
                      placeholder="14999"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="offer-special-price" className={labelClass}>
                      Special price (R)
                    </label>
                    <input
                      id="offer-special-price"
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={draft.specialPrice}
                      onChange={(event) => setDraft({ ...draft, specialPrice: event.target.value })}
                      placeholder="11999"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="offer-start-date" className={labelClass}>
                      Start date
                    </label>
                    <input
                      id="offer-start-date"
                      type="date"
                      value={draft.startsAt}
                      onChange={(event) => setDraft({ ...draft, startsAt: event.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="offer-end-date" className={labelClass}>
                      End date
                    </label>
                    <input
                      id="offer-end-date"
                      type="date"
                      min={draft.startsAt || southAfricanDateKey()}
                      value={draft.endsAt}
                      onChange={(event) => setDraft({ ...draft, endsAt: event.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="offer-image" className={labelClass}>
                    Product photos
                  </label>
                  <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-cream p-4">
                    {(draft.imagePaths.length > 0 || draft.imageFiles.length > 0) && (
                      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {draft.imagePaths.map((path, index) => (
                          <div key={path} className="group relative">
                            <img
                              src={
                                supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data
                                  .publicUrl
                              }
                              alt={`Offer photo ${index + 1}`}
                              className="aspect-square w-full rounded-xl object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setDraft({
                                  ...draft,
                                  imagePaths: draft.imagePaths.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                })
                              }
                              aria-label={`Remove offer photo ${index + 1}`}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-destructive shadow hover:bg-background"
                            >
                              <Trash2 size={14} aria-hidden />
                            </button>
                          </div>
                        ))}
                        {draft.imageFiles.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="group relative">
                            <img
                              src={imagePreviews[index]}
                              alt={`New offer photo ${draft.imagePaths.length + index + 1}`}
                              className="aspect-square w-full rounded-xl object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setDraft({
                                  ...draft,
                                  imageFiles: draft.imageFiles.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                })
                              }
                              aria-label={`Remove new offer photo ${index + 1}`}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-destructive shadow hover:bg-background"
                            >
                              <Trash2 size={14} aria-hidden />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label
                      htmlFor="offer-image"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-xl p-3 text-center transition-colors hover:bg-background/70"
                    >
                      <Upload size={24} className="mb-2 text-primary" aria-hidden />
                      <span className="text-sm font-semibold text-foreground">
                        Choose multiple photos
                      </span>
                      <span className="mt-1 text-xs text-muted-foreground">
                        JPG, PNG or WebP · up to 8 MB each · at least 2 photos required
                      </span>
                      <input
                        id="offer-image"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(event) => {
                          const files = Array.from(event.target.files ?? []);
                          if (files.length > 0) {
                            setDraft({ ...draft, imageFiles: [...draft.imageFiles, ...files] });
                          }
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-pale/60 p-4">
                  <input
                    type="checkbox"
                    checked={draft.isPublished}
                    onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-bold text-foreground">
                      Publish this offer
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Published offers show on the public specials page within the selected dates.
                    </span>
                  </span>
                </label>

                {formError && draft && (
                  <p
                    role="alert"
                    className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    {formError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    <>{editingId ? "Save changes" : "Create offer"}</>
                  )}
                </button>
              </form>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
