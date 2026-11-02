export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  regular_price: number;
  special_price: number;
  image_path: string;
  images: string[];
  image_url: string;
  image_urls: string[];
  is_published: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export type DescriptionBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export function parseOfferDescription(description: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  };

  for (const rawLine of description.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    const bullet = line.match(/^(?:[•*-])\s+(.+)$/);
    if (bullet) {
      listItems.push(bullet[1]);
      continue;
    }

    flushList();
    const heading = line.match(/^#{1,3}\s+(.+)$/) ?? line.match(/^(.+):$/);
    blocks.push(
      heading ? { type: "heading", text: heading[1] } : { type: "paragraph", text: line },
    );
  }

  flushList();
  return blocks;
}

export function getOfferImagePaths(offer: Pick<SpecialOffer, "images" | "image_path">): string[] {
  const paths = offer.images?.length ? offer.images : [offer.image_path];
  return [...new Set(paths.filter(Boolean))];
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
