import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getOfferImagePaths,
  isOfferInDateRange,
  type SpecialOffer,
  type SpecialOfferRow,
} from "@/lib/special-offers";

type OfferLoadState = {
  offers: SpecialOffer[];
  loading: boolean;
  error: string | null;
};

/** Turns a raw `special_offers` row into a SpecialOffer with public image URLs. */
export function withOfferImageUrls(offer: SpecialOfferRow): SpecialOffer {
  const images = getOfferImagePaths(offer);
  const imageUrls = images.map(
    (path) => supabase.storage.from("special-offer-images").getPublicUrl(path).data.publicUrl,
  );
  return {
    ...offer,
    images,
    image_urls: imageUrls,
    image_url: imageUrls[0] ?? "",
  };
}

export function useSpecialOffers(): OfferLoadState {
  const [state, setState] = useState<OfferLoadState>({
    offers: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    void supabase
      .from("special_offers")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setState({ offers: [], loading: false, error: "Special offers could not be loaded." });
          console.error("Could not load special offers:", error);
          return;
        }
        setState({
          offers: (data ?? []).filter(isOfferInDateRange).map(withOfferImageUrls),
          loading: false,
          error: null,
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
