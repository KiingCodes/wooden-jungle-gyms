import { describe, expect, it } from "vitest";
import {
  discountPercent,
  formatZar,
  isOfferInDateRange,
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
    const today = southAfricanDateKey(new Date("2026-11-02T12:00:00+02:00"));
    expect(isOfferInDateRange({ starts_at: today, ends_at: today })).toBe(true);
    expect(isOfferInDateRange({ starts_at: "2026-11-03", ends_at: null })).toBe(false);
    expect(isOfferInDateRange({ starts_at: null, ends_at: "2026-11-01" })).toBe(false);
    expect(isOfferInDateRange({ starts_at: null, ends_at: null })).toBe(true);
  });
});
