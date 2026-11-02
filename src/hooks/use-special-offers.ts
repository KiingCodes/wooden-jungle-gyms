import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isOfferInDateRange, type SpecialOffer } from "@/lib/special-offers";

type OfferLoadState = {
  offers: SpecialOffer[];
  loading: boolean;
  error: string | null;
};

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
          offers: (data ?? []).filter(isOfferInDateRange).map((offer) => ({
            ...offer,
            image_url: supabase.storage.from("special-offer-images").getPublicUrl(offer.image_path)
              .data.publicUrl,
          })),
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
