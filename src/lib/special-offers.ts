export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  regular_price: number;
  special_price: number;
  image_path: string;
  image_url: string;
  is_published: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export function formatZar(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function discountPercent(regularPrice: number, specialPrice: number): number {
  return Math.round(((regularPrice - specialPrice) / regularPrice) * 100);
}

export function southAfricanDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (!year || !month || !day) {
    throw new Error("Could not format the current date for South Africa.");
  }
  return `${year}-${month}-${day}`;
}

export function isOfferInDateRange(offer: Pick<SpecialOffer, "starts_at" | "ends_at">): boolean {
  const today = southAfricanDateKey();
  return (
    (!offer.starts_at || offer.starts_at <= today) && (!offer.ends_at || offer.ends_at >= today)
  );
}
