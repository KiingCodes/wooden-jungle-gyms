CREATE TABLE public.admin_users (
  email text PRIMARY KEY CHECK (email = lower(trim(email)))
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.admin_users TO authenticated;

CREATE POLICY "Admins can view their own access"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (email = lower((SELECT auth.jwt() ->> 'email')));

CREATE TABLE public.special_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 100),
  description text NOT NULL CHECK (length(trim(description)) BETWEEN 1 AND 2000),
  regular_price numeric(12, 2) NOT NULL CHECK (regular_price > 0),
  special_price numeric(12, 2) NOT NULL CHECK (special_price > 0 AND special_price < regular_price),
  image_path text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  starts_at date,
  ends_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT special_offers_valid_dates CHECK (
    starts_at IS NULL OR ends_at IS NULL OR starts_at <= ends_at
  )
);

ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.special_offers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.special_offers TO authenticated;

CREATE POLICY "Visitors can view published special offers"
  ON public.special_offers
  FOR SELECT
  TO anon, authenticated
  USING (
    is_published
    AND (
      starts_at IS NULL
      OR starts_at <= (timezone('Africa/Johannesburg', now())::date)
    )
    AND (
      ends_at IS NULL
      OR ends_at >= (timezone('Africa/Johannesburg', now())::date)
    )
  );

CREATE POLICY "Admins can view all special offers"
  ON public.special_offers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE email = lower((SELECT auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Admins can create special offers"
  ON public.special_offers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE email = lower((SELECT auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Admins can update special offers"
  ON public.special_offers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE email = lower((SELECT auth.jwt() ->> 'email'))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE email = lower((SELECT auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Admins can delete special offers"
  ON public.special_offers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE email = lower((SELECT auth.jwt() ->> 'email'))
    )
  );

CREATE INDEX idx_special_offers_published_dates
  ON public.special_offers (is_published, starts_at, ends_at);

CREATE FUNCTION public.update_special_offer_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER special_offers_updated_at
  BEFORE UPDATE ON public.special_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_special_offer_updated_at();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'special-offer-images',
  'special-offer-images',
  true,
  8388608,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Visitors can view special offer images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'special-offer-images');

CREATE POLICY "Admins can upload special offer images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'special-offer-images'
    AND EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE email = lower((SELECT auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Admins can update special offer images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'special-offer-images'
    AND EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE email = lower((SELECT auth.jwt() ->> 'email'))
    )
  )
  WITH CHECK (
    bucket_id = 'special-offer-images'
    AND EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE email = lower((SELECT auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY "Admins can delete special offer images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'special-offer-images'
    AND EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE email = lower((SELECT auth.jwt() ->> 'email'))
    )
  );
