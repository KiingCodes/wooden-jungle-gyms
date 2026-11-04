import { describe, expect, it } from "vitest";
import {
  discountPercent,
  formatZar,
  getOfferImagePaths,
  isOfferInDateRange,
  parseOfferDescription,
  southAfricanDateKey,
} from "@/lib/special-offers";

describe("special offer helpers", () => {
  it("calculates a rounded discount percentage", () => {
    expect(discountPercent(1000, 750)).toBe(25);
  });

  it("formats prices as South African rand", () => {
    expect(formatZar(1250)).toContain("1");
    expect(formatZar(1250)).toContain("R");
  });

  it("uses local calendar dates for scheduled offer boundaries", () => {
    // Local-calendar conversion is deterministic: SA noon is the same calendar day.
    expect(southAfricanDateKey(new Date("2026-11-02T12:00:00+02:00"))).toBe("2026-11-02");
    // Range boundaries are relative to the real current date so the test never expires.
    const dayMs = 24 * 60 * 60 * 1000;
    const today = southAfricanDateKey();
    expect(isOfferInDateRange({ starts_at: today, ends_at: today })).toBe(true);
    expect(
      isOfferInDateRange({ starts_at: southAfricanDateKey(new Date(Date.now() + dayMs)), ends_at: null }),
    ).toBe(false);
    expect(
      isOfferInDateRange({ starts_at: null, ends_at: southAfricanDateKey(new Date(Date.now() - dayMs)) }),
    ).toBe(false);
    expect(isOfferInDateRange({ starts_at: null, ends_at: null })).toBe(true);
  });

  it("parses multiline offer copy into headings, paragraphs, and bullet lists", () => {
    expect(
      parseOfferDescription(
        "The Explorer:\r\n• Timber roof\r\n- Wave slide\r\n\r\nA lovely fit for active kids.",
      ),
    ).toEqual([
      { type: "heading", text: "The Explorer" },
      { type: "list", items: ["Timber roof", "Wave slide"] },
      { type: "paragraph", text: "A lovely fit for active kids." },
    ]);
  });

  it("keeps image arrays unique and falls back to the legacy image", () => {
    expect(
      getOfferImagePaths({
        images: ["first.jpg", "second.jpg", "first.jpg"],
        image_path: "legacy.jpg",
      }),
    ).toEqual(["first.jpg", "second.jpg"]);
    expect(getOfferImagePaths({ images: [], image_path: "legacy.jpg" })).toEqual(["legacy.jpg"]);
  });
});
